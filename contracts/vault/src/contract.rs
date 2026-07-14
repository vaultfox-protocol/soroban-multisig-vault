//! Multi-Sig Vault — core contract logic

#![allow(deprecated)]

use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, String, Vec};
use crate::{
    errors::VaultError,
    storage,
    types::{Proposal, ProposalStatus, ProposalType, VaultConfig},
};

const MAX_SIGNERS: u32 = 10;
const MAX_PENDING: u32 = 20;
const DEFAULT_TTL: u32 = 17_280 * 7; // ~7 days in ledgers

#[contract]
pub struct VaultContract;

#[contractimpl]
impl VaultContract {

    /// Initialize vault with signers and M-of-N threshold.
    pub fn initialize(env: Env, signers: Vec<Address>, threshold: u32) -> Result<(), VaultError> {
        if storage::get_config(&env).is_some() { return Err(VaultError::AlreadyInitialized); }
        if signers.is_empty() || signers.len() > MAX_SIGNERS { return Err(VaultError::TooManySigners); }
        if threshold == 0 || threshold > signers.len() { return Err(VaultError::InvalidThreshold); }

        storage::set_config(&env, &VaultConfig { signers, threshold, proposal_ttl_ledgers: DEFAULT_TTL });
        env.events().publish((symbol_short!("INIT"),), threshold);
        Ok(())
    }

    /// Propose a token transfer. Proposer auto-approves.
    pub fn propose_transfer(
        env: Env, proposer: Address, token: Address,
        recipient: Address, amount: i128, description: String,
    ) -> Result<u32, VaultError> {
        proposer.require_auth();
        let config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        Self::assert_signer(&config, &proposer)?;
        if amount <= 0 { return Err(VaultError::InvalidAmount); }
        if storage::get_pending_count(&env) >= MAX_PENDING { return Err(VaultError::TooManyProposals); }

        let id = storage::increment_proposal_count(&env);
        let mut approvals = Vec::new(&env);
        approvals.push_back(proposer.clone());
        let dummy = env.current_contract_address();

        storage::set_proposal(&env, &Proposal {
            id, proposal_type: ProposalType::Transfer,
            proposer: proposer.clone(), recipient, token, amount,
            target_signer: dummy, description, approvals,
            rejections: Vec::new(&env),
            expires_at: env.ledger().sequence() + config.proposal_ttl_ledgers,
            status: ProposalStatus::Pending,
        });
        storage::set_pending_count(&env, storage::get_pending_count(&env) + 1);
        env.events().publish((symbol_short!("PROPOSED"), id), proposer);
        Ok(id)
    }

    /// Propose adding a new signer.
    pub fn propose_add_signer(
        env: Env, proposer: Address, new_signer: Address, description: String,
    ) -> Result<u32, VaultError> {
        proposer.require_auth();
        let config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        Self::assert_signer(&config, &proposer)?;
        if config.signers.len() >= MAX_SIGNERS { return Err(VaultError::TooManySigners); }
        if Self::is_signer(&config, &new_signer) { return Err(VaultError::SignerAlreadyExists); }

        let id = storage::increment_proposal_count(&env);
        let mut approvals = Vec::new(&env);
        approvals.push_back(proposer.clone());
        let dummy = env.current_contract_address();

        storage::set_proposal(&env, &Proposal {
            id, proposal_type: ProposalType::AddSigner,
            proposer: proposer.clone(), recipient: dummy.clone(), token: dummy,
            amount: 0, target_signer: new_signer, description, approvals,
            rejections: Vec::new(&env),
            expires_at: env.ledger().sequence() + config.proposal_ttl_ledgers,
            status: ProposalStatus::Pending,
        });
        storage::set_pending_count(&env, storage::get_pending_count(&env) + 1);
        env.events().publish((symbol_short!("PROPOSED"), id), proposer);
        Ok(id)
    }

    /// Propose removing a signer.
    pub fn propose_remove_signer(
        env: Env, proposer: Address, signer_to_remove: Address, description: String,
    ) -> Result<u32, VaultError> {
        proposer.require_auth();
        let config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        Self::assert_signer(&config, &proposer)?;
        if !Self::is_signer(&config, &signer_to_remove) { return Err(VaultError::SignerNotFound); }
        if config.threshold > config.signers.len() - 1 { return Err(VaultError::InvalidThreshold); }

        let id = storage::increment_proposal_count(&env);
        let mut approvals = Vec::new(&env);
        approvals.push_back(proposer.clone());
        let dummy = env.current_contract_address();

        storage::set_proposal(&env, &Proposal {
            id, proposal_type: ProposalType::RemoveSigner,
            proposer: proposer.clone(), recipient: dummy.clone(), token: dummy,
            amount: 0, target_signer: signer_to_remove, description, approvals,
            rejections: Vec::new(&env),
            expires_at: env.ledger().sequence() + config.proposal_ttl_ledgers,
            status: ProposalStatus::Pending,
        });
        storage::set_pending_count(&env, storage::get_pending_count(&env) + 1);
        env.events().publish((symbol_short!("PROPOSED"), id), proposer);
        Ok(id)
    }

    /// Signer approves a proposal. Moves to Approved when threshold is met.
    pub fn approve(env: Env, signer: Address, proposal_id: u32) -> Result<ProposalStatus, VaultError> {
        signer.require_auth();
        let config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        Self::assert_signer(&config, &signer)?;

        let mut proposal = storage::get_proposal(&env, proposal_id).ok_or(VaultError::ProposalNotFound)?;
        if proposal.status != ProposalStatus::Pending { return Err(VaultError::InvalidStatus); }
        if env.ledger().sequence() > proposal.expires_at {
            proposal.status = ProposalStatus::Cancelled;
            storage::set_proposal(&env, &proposal);
            return Err(VaultError::ProposalExpired);
        }
        if Self::has_voted(&proposal, &signer) { return Err(VaultError::AlreadyVoted); }

        proposal.approvals.push_back(signer.clone());
        if proposal.approvals.len() >= config.threshold {
            proposal.status = ProposalStatus::Approved;
        }
        storage::set_proposal(&env, &proposal);
        env.events().publish((symbol_short!("APPROVED"), proposal_id), signer);
        Ok(proposal.status)
    }

    /// Signer rejects a proposal.
    pub fn reject(env: Env, signer: Address, proposal_id: u32) -> Result<(), VaultError> {
        signer.require_auth();
        let config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        Self::assert_signer(&config, &signer)?;

        let mut proposal = storage::get_proposal(&env, proposal_id).ok_or(VaultError::ProposalNotFound)?;
        if proposal.status != ProposalStatus::Pending { return Err(VaultError::InvalidStatus); }
        if Self::has_voted(&proposal, &signer) { return Err(VaultError::AlreadyVoted); }

        proposal.rejections.push_back(signer.clone());
        let impossible = config.signers.len() - config.threshold + 1;
        if proposal.rejections.len() >= impossible {
            proposal.status = ProposalStatus::Cancelled;
            storage::set_pending_count(&env, storage::get_pending_count(&env).saturating_sub(1));
        }
        storage::set_proposal(&env, &proposal);
        env.events().publish((symbol_short!("REJECTED"), proposal_id), signer);
        Ok(())
    }

    /// Execute an approved proposal. Anyone can call once threshold is met.
    pub fn execute(env: Env, proposal_id: u32) -> Result<(), VaultError> {
        let mut config = storage::get_config(&env).ok_or(VaultError::NotInitialized)?;
        let mut proposal = storage::get_proposal(&env, proposal_id).ok_or(VaultError::ProposalNotFound)?;

        if proposal.status != ProposalStatus::Approved { return Err(VaultError::InvalidStatus); }
        if env.ledger().sequence() > proposal.expires_at {
            proposal.status = ProposalStatus::Cancelled;
            storage::set_proposal(&env, &proposal);
            return Err(VaultError::ProposalExpired);
        }

        match proposal.proposal_type.clone() {
            ProposalType::Transfer => {
                token::TokenClient::new(&env, &proposal.token)
                    .transfer(&env.current_contract_address(), &proposal.recipient, &proposal.amount);
            }
            ProposalType::AddSigner => {
                config.signers.push_back(proposal.target_signer.clone());
                storage::set_config(&env, &config);
            }
            ProposalType::RemoveSigner => {
                if let Some(i) = Self::find_signer_index(&config, &proposal.target_signer) {
                    config.signers.remove(i);
                    storage::set_config(&env, &config);
                }
            }
            ProposalType::ChangeThreshold => {
                let new_t = proposal.amount as u32;
                if new_t == 0 || new_t > config.signers.len() { return Err(VaultError::InvalidThreshold); }
                config.threshold = new_t;
                storage::set_config(&env, &config);
            }
        }

        proposal.status = ProposalStatus::Executed;
        storage::set_proposal(&env, &proposal);
        storage::set_pending_count(&env, storage::get_pending_count(&env).saturating_sub(1));
        env.events().publish((symbol_short!("EXECUTED"), proposal_id), ());
        Ok(())
    }

    // ── Read-only ─────────────────────────────────────────────────────────────

    pub fn get_config(env: Env) -> Result<VaultConfig, VaultError> {
        storage::get_config(&env).ok_or(VaultError::NotInitialized)
    }

    pub fn get_proposal(env: Env, proposal_id: u32) -> Result<Proposal, VaultError> {
        storage::get_proposal(&env, proposal_id).ok_or(VaultError::ProposalNotFound)
    }

    pub fn get_proposal_count(env: Env) -> u32 {
        storage::get_proposal_count(&env)
    }

    pub fn is_signer_check(env: Env, address: Address) -> bool {
        match storage::get_config(&env) {
            Some(config) => Self::is_signer(&config, &address),
            None => false,
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    fn assert_signer(config: &VaultConfig, address: &Address) -> Result<(), VaultError> {
        if !Self::is_signer(config, address) { return Err(VaultError::NotSigner); }
        Ok(())
    }

    fn is_signer(config: &VaultConfig, address: &Address) -> bool {
        (0..config.signers.len()).any(|i| config.signers.get(i).unwrap() == *address)
    }

    fn find_signer_index(config: &VaultConfig, address: &Address) -> Option<u32> {
        (0..config.signers.len()).find(|&i| config.signers.get(i).unwrap() == *address)
    }

    fn has_voted(proposal: &Proposal, signer: &Address) -> bool {
        let a = (0..proposal.approvals.len()).any(|i| proposal.approvals.get(i).unwrap() == *signer);
        let r = (0..proposal.rejections.len()).any(|i| proposal.rejections.get(i).unwrap() == *signer);
        a || r
    }
}
