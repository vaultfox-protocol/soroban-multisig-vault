# Scoped Issues — Soroban MultiSig Vault

This file describes the open issues available for Wave Program contributors.
Pick one, comment on the GitHub issue to claim it, and submit a PR.

---

## Issue #1 — Write full test suite using Soroban testutils

**Label:** `complexity:high` | **Points:** 80  
**Type:** Testing

The contract has no automated test coverage. This issue covers writing a comprehensive test suite using `soroban-sdk`'s built-in testutils.

**Scope:**
- Unit tests for `initialize`, `propose_transfer`, `propose_add_signer`, `propose_remove_signer`
- Unit tests for `approve` and `reject` including threshold logic
- Unit tests for `execute` for all `ProposalType` variants
- Edge case tests: double-voting, expired proposals, threshold-boundary conditions
- Integration test: full 2-of-3 approval and execution flow

**File:** `contracts/vault/src/tests/` (create this directory)  
**Run:** `cargo test`

---

## Issue #2 — Add `propose_change_threshold` function

**Label:** `complexity:medium` | **Points:** 40  
**Type:** New Feature

The `ChangeThreshold` variant exists in `ProposalType` and is handled in `execute`, but there is no `propose_change_threshold` function to create such a proposal. This needs to be added.

**Scope:**
- Add `propose_change_threshold(env, proposer, new_threshold, description)` to `contract.rs`
- Validate that `new_threshold > 0` and `new_threshold <= signers.len()`
- Follow the same proposer auto-approve pattern as other propose functions
- Add test coverage

**Files:** `contracts/vault/src/contract.rs`

---

## Issue #3 — Build vault dashboard page (`/vault`)

**Label:** `complexity:medium` | **Points:** 40  
**Type:** New Feature / Frontend

The `/vault` route exists in the nav but has no page. Build a dashboard that reads on-chain state and displays it.

**Scope:**
- Display current vault config: signer list, threshold, contract ID
- Display pending proposal count vs. max (20)
- List the 5 most recent proposals with status badges
- Link to `/vault/proposals` for the full list
- Connect to Freighter wallet via `stellar-wallets-kit`
- Read-only: calls `get_config` and `get_proposal_count` via `@stellar/stellar-sdk`

**File:** `frontend/src/app/vault/page.tsx`

---

## Issue #4 — Add proposal detail page (`/vault/proposals/[id]`)

**Label:** `complexity:medium` | **Points:** 40  
**Type:** New Feature / Frontend

Contributors need a dedicated page per proposal showing full details, the approval/rejection list, and action buttons.

**Scope:**
- Dynamic route `/vault/proposals/[id]`
- Display all proposal fields: type, description, proposer, recipient/token/amount or target signer, expires_at, status
- Show list of approver addresses and rejection addresses
- Show approval progress bar
- Approve / Reject / Execute buttons (connected to contract via Freighter)
- Handle expired and cancelled states gracefully

**File:** `frontend/src/app/vault/proposals/[id]/page.tsx`

---

## Issue #5 — Connect proposal form to live contract

**Label:** `complexity:high` | **Points:** 80  
**Type:** Soroban Integration

The `/vault/propose` form currently simulates a submission with a 1-second timeout. Wire it to the actual deployed contract.

**Scope:**
- Connect Freighter wallet on form load
- On submit, call the appropriate contract function (`propose_transfer`, `propose_add_signer`, `propose_remove_signer`) using `@stellar/stellar-sdk`
- Handle transaction signing with `stellar-wallets-kit`
- Display real proposal ID from the contract return value
- Handle errors: wallet not connected, insufficient auth, contract errors
- Amount input should handle stroops conversion (multiply by 10_000_000)

**Files:** `frontend/src/app/vault/propose/page.tsx`, `frontend/src/lib/` (create contract helpers)

---

## Issue #6 — Connect proposals list to live contract

**Label:** `complexity:high` | **Points:** 80  
**Type:** Soroban Integration

The `/vault/proposals` page uses mock data. Replace it with real on-chain data.

**Scope:**
- Fetch `get_proposal_count` then fetch each proposal with `get_proposal`
- Map contract types to display types
- Wire Approve / Reject / Execute buttons to contract calls via Freighter
- Poll for updates every 5 seconds or on user action
- Show loading skeleton while fetching
- Show empty state if no proposals exist

**Files:** `frontend/src/app/vault/proposals/page.tsx`

---

## Issue #7 — Add transaction batching proposal type

**Label:** `complexity:critical` | **Points:** 150  
**Type:** New Contract Feature

Add a `BatchTransfer` proposal type that executes multiple token transfers in a single approved proposal.

**Scope:**
- Add `BatchTransfer` variant to `ProposalType` in `types.rs`
- Add `transfers: Vec<TransferItem>` field to `Proposal` (define `TransferItem { recipient, token, amount }`)
- Add `propose_batch_transfer` function in `contract.rs`
- Cap batch size at 10 transfers (DoS prevention)
- Handle execution in the `execute` match arm
- Add full test coverage
- Update README with new function table entry

**Files:** `contracts/vault/src/contract.rs`, `contracts/vault/src/types.rs`

---

## Issue #8 — Build TypeScript SDK for vault operations

**Label:** `complexity:high` | **Points:** 80  
**Type:** New Feature / Tooling

Create a reusable TypeScript client library for all vault operations so the frontend and external integrators don't repeat boilerplate.

**Scope:**
- `VaultClient` class wrapping all contract functions
- Methods: `initialize`, `proposeTransfer`, `proposeAddSigner`, `proposeRemoveSigner`, `approve`, `reject`, `execute`, `getConfig`, `getProposal`, `getProposalCount`
- Proper TypeScript types mirroring Rust structs
- Handle stroop ↔ token amount conversion
- README section with usage examples

**File:** `frontend/src/lib/vaultClient.ts`

---

## Issue #9 — Add spending limits per signer

**Label:** `complexity:critical` | **Points:** 150  
**Type:** New Contract Feature

Allow the vault config to define per-signer maximum transfer amounts that cannot be exceeded in a single transfer proposal.

**Scope:**
- Add `spending_limits: Map<Address, i128>` (or equivalent) to `VaultConfig`
- Add `set_spending_limit` proposal type and function
- Validate transfer amounts against the proposer's limit in `propose_transfer`
- Add test coverage for limit enforcement and bypass attempts

**Files:** `contracts/vault/src/contract.rs`, `contracts/vault/src/types.rs`, `contracts/vault/src/storage.rs`

---

## Issue #10 — Write deployment and integration guide

**Label:** `complexity:low` | **Points:** 15  
**Type:** Documentation

New contributors struggle to get from zero to a deployed vault. Write a step-by-step guide.

**Scope:**
- Step-by-step from `stellar keys generate` through `initialize` call
- How to call `initialize` with a signer list via Stellar CLI
- How to set up ngrok or a public RPC for frontend testing
- Troubleshooting section: common errors and fixes
- Screenshots or ASCII diagrams of the workflow

**File:** `docs/DEPLOYMENT.md`

---

## Issue #11 — Add Docker + one-click local setup

**Label:** `complexity:low` | **Points:** 15  
**Type:** Developer Experience

Contributors need a fast way to spin up the full stack locally without manual environment setup.

**Scope:**
- `Dockerfile` for the frontend
- `docker-compose.yml` that runs the frontend and sets environment variables
- Update README with Docker instructions
- Verify it works from a clean clone

**Files:** `Dockerfile`, `docker-compose.yml`

---

## Issue #12 — Add `get_proposals_by_status` query function

**Label:** `complexity:medium` | **Points:** 40  
**Type:** New Contract Feature

The contract has no way to query proposals by status. Indexers and UIs need to filter pending proposals without fetching all of them.

**Scope:**
- Add `get_proposals_by_status(env, status: ProposalStatus) -> Vec<Proposal>` to `contract.rs`
- Iterate stored proposals (up to `proposal_count`) and return matches
- Be mindful of ledger compute limits — add a `limit` parameter capped at 20
- Add test coverage

**Files:** `contracts/vault/src/contract.rs`
