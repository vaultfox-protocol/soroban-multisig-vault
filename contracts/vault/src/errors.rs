use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum VaultError {
    AlreadyInitialized  = 1,
    NotInitialized      = 2,
    NotSigner           = 3,
    AlreadyVoted        = 4,
    ProposalNotFound    = 5,
    ProposalExpired     = 6,
    InvalidStatus       = 7,
    ThresholdNotMet     = 8,
    InvalidThreshold    = 9,
    TooManySigners      = 10,
    TooManyProposals    = 11,
    SignerAlreadyExists = 12,
    SignerNotFound      = 13,
    InvalidAmount       = 14,
    InsufficientBalance = 15,
}
