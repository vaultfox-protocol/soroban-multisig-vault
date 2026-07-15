# Soroban MultiSig Vault

A production-grade M-of-N multi-signature treasury contract for Stellar Soroban.
The standard governance and treasury primitive that every DAO, team, and protocol on Stellar needs.

---

## Why This Exists

Every serious project managing shared funds needs multi-sig. Ethereum has Gnosis Safe. Stellar had nothing open-source and production-ready — until now.

Soroban MultiSig Vault gives any Stellar team a trustless, on-chain treasury with proposal-based governance, configurable M-of-N thresholds, and time-locked execution.

---

## Deployed Contract (Stellar Testnet)

| Contract | ID |
|---|---|
| Vault | `CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52` |

🔍 [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52)

---

## Architecture

```
soroban-multisig-vault/
├── contracts/
│   └── vault/               # Core multi-sig contract (Rust/Soroban)
│       └── src/
│           ├── contract.rs  # initialize, propose, approve, reject, execute
│           ├── types.rs     # Proposal, VaultConfig, ProposalType, ProposalStatus
│           ├── errors.rs    # VaultError codes
│           └── storage.rs   # Persistent storage helpers + TTL management
├── frontend/                # Next.js 15 + TypeScript dApp
│   └── src/app/
│       ├── page.tsx                  # Landing page
│       └── vault/
│           ├── page.tsx              # Vault dashboard
│           ├── propose/page.tsx      # Create proposal form
│           └── proposals/page.tsx    # Browse and act on proposals
├── docs/
│   └── ISSUES.md            # Scoped issues for Wave Program contributors
└── scripts/
    └── deploy.sh            # Build + deploy to Stellar Testnet
```

---

## Smart Contract

### Vault Functions

| Function | Who Calls It | What It Does |
|---|---|---|
| `initialize` | Deployer | Sets signers and M-of-N threshold |
| `propose_transfer` | Any signer | Proposes a token transfer; proposer auto-approves |
| `propose_add_signer` | Any signer | Proposes adding a new signer |
| `propose_remove_signer` | Any signer | Proposes removing a signer |
| `approve` | Any signer | Approves a pending proposal |
| `reject` | Any signer | Rejects a pending proposal |
| `execute` | Anyone | Executes a fully-approved proposal |
| `get_config` | Anyone | Returns vault signers and threshold |
| `get_proposal` | Anyone | Returns a proposal by ID |
| `get_proposal_count` | Anyone | Returns total proposal count |
| `is_signer_check` | Anyone | Checks if an address is a signer |

### ProposalType Variants

| Type | Description |
|---|---|
| `Transfer` | Move tokens from vault to recipient |
| `AddSigner` | Add a new address to the signer set |
| `RemoveSigner` | Remove an address from the signer set |
| `ChangeThreshold` | Update the M-of-N approval threshold |

### ProposalStatus Flow

```
Pending → Approved → Executed
       ↘ Cancelled (via rejections or expiry)
```

---

## Security Highlights

- `require_auth()` on every signer action — no unsigned calls succeed
- `overflow-checks = true` in Cargo profile — arithmetic overflows panic, not wrap
- Max 10 signers and 20 pending proposals (DoS prevention)
- Double-voting prevented per address per proposal
- Proposals expire after ~7 days (17,280 ledgers × 7)
- Automatic cancellation when enough rejections make approval mathematically impossible
- Threshold always validated against current signer count
- No `unsafe` code

---

## Getting Started

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install stellar-cli
cargo install --locked stellar-cli

# Install wasm target
rustup target add wasm32v1-none
```

### Build contracts

```bash
cd soroban-multisig-vault
stellar contract build
```

### Run tests

```bash
cargo test
```

### Deploy to Testnet

```bash
# Generate and fund a keypair
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet

# Deploy and write contract ID to frontend/.env.local
DEPLOYER_KEY=deployer ./scripts/deploy.sh
```

### Run the frontend

```bash
cd frontend
cp .env.example .env.local
# Fill in your values
npm install
npm run dev
# Open http://localhost:3000
```

---

## Frontend

Built with:
- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v3**
- **@stellar/stellar-sdk** for contract interaction
- **stellar-wallets-kit** for Freighter + multi-wallet support
- **Zustand** for wallet state
- **lucide-react** for icons

Key pages:
- `/` — Overview and entry points
- `/vault` — Dashboard: balance, signers, pending proposals
- `/vault/propose` — Create a new proposal
- `/vault/proposals` — Browse all proposals and vote

---

## Contributing

This project participates in the **Stellar Wave Program on Drips**.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution guide and [docs/ISSUES.md](./docs/ISSUES.md) for scoped issues ready to be picked up.

1. Browse open issues
2. Comment to express interest
3. Fork → branch → code → PR

---

## Organization

**[github.com/vaultfox-protocol](https://github.com/vaultfox-protocol)**

---

## License

Apache 2.0 — same as the Stellar ecosystem.
