use soroban_sdk::{symbol_short, Env};
use crate::types::{Proposal, VaultConfig};

const TTL: u32 = 30 * 24 * 60 * 12;

pub fn get_config(env: &Env) -> Option<VaultConfig> {
    env.storage().instance().get(&symbol_short!("CONFIG"))
}

pub fn set_config(env: &Env, config: &VaultConfig) {
    env.storage().instance().set(&symbol_short!("CONFIG"), config);
    env.storage().instance().extend_ttl(TTL, TTL);
}

pub fn get_proposal(env: &Env, id: u32) -> Option<Proposal> {
    env.storage().persistent().get(&(symbol_short!("PROP"), id))
}

pub fn set_proposal(env: &Env, proposal: &Proposal) {
    let key = (symbol_short!("PROP"), proposal.id);
    env.storage().persistent().set(&key, proposal);
    env.storage().persistent().extend_ttl(&key, TTL, TTL);
}

pub fn get_proposal_count(env: &Env) -> u32 {
    env.storage().instance().get(&symbol_short!("PCOUNT")).unwrap_or(0u32)
}

pub fn increment_proposal_count(env: &Env) -> u32 {
    let next = get_proposal_count(env) + 1;
    env.storage().instance().set(&symbol_short!("PCOUNT"), &next);
    env.storage().instance().extend_ttl(TTL, TTL);
    next
}

pub fn get_pending_count(env: &Env) -> u32 {
    env.storage().instance().get(&symbol_short!("PENDING")).unwrap_or(0u32)
}

pub fn set_pending_count(env: &Env, count: u32) {
    env.storage().instance().set(&symbol_short!("PENDING"), &count);
    env.storage().instance().extend_ttl(TTL, TTL);
}
