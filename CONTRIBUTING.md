# Contributing to Soroban MultiSig Vault

Thank you for your interest in contributing to Soroban MultiSig Vault! This project is part of the **Stellar Wave Program on Drips** and actively welcomes contributors of all levels.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install prerequisites:**
   - Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
   - WASM target: `rustup target add wasm32v1-none`
   - Stellar CLI: `cargo install --locked stellar-cli`
4. **Build contracts:** `stellar contract build`
5. **Run tests:** `cargo test`
6. **Set up frontend:**
   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

---

## How to Contribute

### Pick an Issue

- Browse [open issues](https://github.com/vaultfox-protocol/soroban-multisig-vault/issues)
- Check [docs/ISSUES.md](./docs/ISSUES.md) for detailed descriptions of scoped work
- Comment on the issue to express interest before starting
- Wait for assignment confirmation from a maintainer

### Submit a Pull Request

- Create a branch: `git checkout -b feat/your-feature`
- Write clean, well-commented code
- Add tests for any new contract logic
- Run `cargo test` and `npm run type-check` before submitting
- Open a PR with a clear description of the problem and solution
- Reference the issue number in your PR description (`Closes #N`)

---

## Code Standards

### Rust (contracts)

- All code must pass `cargo clippy -- -D warnings`
- No `unsafe` blocks
- Every public function must have a doc comment
- Tests required for all new contract logic
- Follow existing patterns in `contract.rs` for new functions

### TypeScript (frontend)

- TypeScript strict mode — no `any` types
- All components must be properly typed
- Run `npm run type-check` before submitting
- Follow the existing Next.js App Router patterns

---

## Issue Complexity Levels

| Label | Points | Description |
|---|---|---|
| `good first issue` | — | Great for newcomers, well-scoped |
| `complexity:low` | 15 pts | Small fixes, docs improvements |
| `complexity:medium` | 40 pts | Standard features, test coverage |
| `complexity:high` | 80 pts | Complex integrations, Soroban-specific work |
| `complexity:critical` | 150 pts | Major features, security-sensitive |

---

## Project Structure

```
contracts/vault/src/
├── contract.rs   # All contract functions — start here
├── types.rs      # Data structures — Proposal, VaultConfig, enums
├── errors.rs     # Error codes — add new errors here
└── storage.rs    # Storage helpers — persist and retrieve state

frontend/src/app/
├── page.tsx                  # Landing page
└── vault/
    ├── page.tsx              # Dashboard
    ├── propose/page.tsx      # Create proposal
    └── proposals/page.tsx    # List proposals
```

---

## Need Help?

- Open a [GitHub Discussion](https://github.com/vaultfox-protocol/soroban-multisig-vault/discussions)
- Comment on the relevant issue
- We respond to all PRs within 48 hours

**Organization:** [github.com/vaultfox-protocol](https://github.com/vaultfox-protocol)
