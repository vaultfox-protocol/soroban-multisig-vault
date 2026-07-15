# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| `main` branch | ✅ |
| All others | ❌ |

This project is currently in testnet phase. Do not use it to manage mainnet funds without a full independent audit.

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue, please report it responsibly:

1. Email the maintainers at: **security@vaultfox-protocol.dev** *(or open a private GitHub security advisory)*
2. Include a description of the vulnerability, steps to reproduce, and potential impact
3. We will acknowledge your report within 48 hours
4. We will work with you on a fix and coordinate disclosure

---

## Known Security Properties

The following properties are enforced by the contract:

- `require_auth()` is called on every signer action — no unsigned state changes succeed
- `overflow-checks = true` — integer overflow panics rather than wrapping
- Double-voting is prevented per signer per proposal
- Proposals expire after ~7 days to prevent stale approvals from executing
- Automatic cancellation when approval becomes mathematically impossible
- Threshold is always validated to be ≤ current signer count
- Maximum 10 signers and 20 pending proposals to prevent DoS
- No `unsafe` Rust code anywhere in the codebase

---

## Out of Scope

The following are considered acceptable risks for the current testnet phase:

- Griefing attacks that waste signer gas (low impact, no fund loss)
- Frontend phishing (mitigate with your own hosting)
- Issues requiring physical access to a signer's device

---

## Acknowledgements

We appreciate responsible disclosure and will credit researchers in release notes.
