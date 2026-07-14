use soroban_sdk::{contracttype, Address, String, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProposalType {
    Transfer,
    AddSigner,
    RemoveSigner,
    ChangeThreshold,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ProposalStatus {
    Pending,
    Approved,
    Executed,
    Cancelled,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Proposal {
    pub id: u32,
    pub proposal_type: ProposalType,
    pub proposer: Address,
    pub recipient: Address,
    pub token: Address,
    pub amount: i128,
    pub target_signer: Address,
    pub description: String,
    pub approvals: Vec<Address>,
    pub rejections: Vec<Address>,
    pub expires_at: u32,
    pub status: ProposalStatus,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct VaultConfig {
    pub signers: Vec<Address>,
    pub threshold: u32,
    pub proposal_ttl_ledgers: u32,
}
