# Soroban MultiSig Vault

## Deployed Contract (Stellar Testnet)

| Contract | ID |
|---|---|
| Vault | `CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52` |

🔍 [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52)

---

A production-grade M-of-N multi-signature treasury contract for Stellar.
The standard governance and treasury primitive that every DAO, team, and protocol on Stellar needs.

---

## Why This Exists

Every serious project managing shared funds needs multi-sig. Ethereum has Gnosis Safe. Stellar had nothing — until now.

FoxLock Vault gives any Stellar team a trustless, on-chain treasury with proposal-based governance, configurable thresholds, and time-locked execution.

---

## Architecture

```
soroban-multisig-vault/
├── contracts/
│   └── vault/           # Soroban multi-sig contract (Rust)
│       └── src/
│           ├── contract.rs  # initialize, propose, approve, reject, execute
│           ├── types.rs     # Proposal, VaultConfig, ProposalType, ProposalStatus
│           ├── errors.rs    # VaultError codes
│           └── storage.rs   # Persistent storage helpers + TTL
├── frontend/            # Next.js 15 + TypeScript dApp
│   └── src/app/
│       ├── page.tsx                 # Landing page
│       └── vault/
│           ├── propose/             # Create proposal form
│           └── proposals/           # Browse and act on proposals
└── scripts/
    └── deploy.sh        # Build + deploy to Stellar Testnet
```

---

## Smart Contract

| Function | Who Calls | Description |
|---|---|---|
| `initialize` | Deployer | Set signers and M-of-N threshold |
| `propose_transfer` | Any signer | Propose a token transfer |
| `propose_add_signer` | Any signer | Propose adding a new signer |
| `propose_remove_signer` | Any signer | Propose removing a signer |
| `approve` | Any signer | Approve a proposal |
| `reject` | Any signer | Reject a proposal |
| `execute` | Anyone | Execute an approved proposal |
| `get_config` | Anyone | Read vault signers and threshold |
| `get_proposal` | Anyone | Read a proposal by ID |
| `is_signer_check` | Anyone | Check if address is a signer |

---

## Security Highlights

- `require_auth()` on every signer action
- `overflow-checks = true` in Cargo profile
- Max 10 signers and 20 pending proposals (DoS prevention)
- Double-voting prevented per address per proposal
- Proposals expire after ~7 days (time-lock)
- Automatic cancellation when rejection makes approval impossible
- Threshold always validated against signer count

---

## Getting Started

```bash
# Build
stellar contract build

# Deploy
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/vault.wasm \
  --source deployer --network testnet

# Frontend
cd frontend && npm install && npm run dev
```

---

## Open Issues for Contributors

1. Add transaction batching — execute multiple transfers in one proposal
2. Write full test suite using Soroban testutils (unit + integration)
3. Build vault dashboard showing balance, signers, and pending proposals
4. Add proposal comments — allow signers to leave notes when voting
5. Add time-delay execution — enforce a waiting period after approval
6. Build TypeScript SDK for all vault operations
7. Add spending limits — set per-signer max transfer amounts
8. Add role-based access — read-only observers vs. active signers
9. Write migration guide for teams moving from centralized custody
10. Add Docker + one-click deploy setup

---

## Contributing

This project participates in the Stellar Wave Program on Drips.
Pick an open issue, apply at [drips.network/wave](https://drips.network/wave), and submit a PR.

---

## License

Apache 2.0
