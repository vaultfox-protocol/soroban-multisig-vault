//! Soroban Multi-Sig Vault
//!
//! A production-grade M-of-N multi-signature treasury contract for Stellar.
//! Any team, DAO, or protocol can use this to manage shared funds securely.
//!
//! ## Features
//! - M-of-N signature threshold (e.g. 2-of-3, 3-of-5)
//! - Propose, approve, reject, and execute token transfers
//! - Add and remove signers via governance proposals
//! - Time-lock: proposals expire after a configurable window
//! - Full event emission for off-chain indexing
//! - Max 10 signers, max 20 pending proposals (DoS prevention)

#![no_std]

mod contract;
mod errors;
mod types;
mod storage;

pub use contract::VaultContract;
pub use errors::VaultError;
pub use types::{Proposal, ProposalStatus, ProposalType};

#[cfg(any(test, feature = "testutils"))]
pub use contract::VaultContractClient;
