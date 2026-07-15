/**
 * VaultClient — TypeScript wrapper for the Soroban MultiSig Vault contract.
 *
 * TODO (Issue #8): Implement all methods using @stellar/stellar-sdk.
 * This file is a typed stub so the compiler enforces the contract interface.
 *
 * Usage (once implemented):
 *   const client = new VaultClient(contractId, rpcUrl, networkPassphrase);
 *   const config = await client.getConfig();
 *   const proposalId = await client.proposeTransfer(signer, token, recipient, amount, description);
 */

// ── Types mirroring the Rust contract ─────────────────────────────────────────

export type ProposalType = "Transfer" | "AddSigner" | "RemoveSigner" | "ChangeThreshold";
export type ProposalStatus = "Pending" | "Approved" | "Executed" | "Cancelled";

export interface VaultConfig {
  signers: string[];
  threshold: number;
  proposalTtlLedgers: number;
}

export interface Proposal {
  id: number;
  proposalType: ProposalType;
  proposer: string;
  recipient: string;
  token: string;
  amount: bigint;
  targetSigner: string;
  description: string;
  approvals: string[];
  rejections: string[];
  expiresAt: number;
  status: ProposalStatus;
}

// ── Conversion helpers ────────────────────────────────────────────────────────

/** Convert a human-readable token amount to stroops (7 decimal places). */
export function toStroops(amount: number): bigint {
  return BigInt(Math.round(amount * 10_000_000));
}

/** Convert stroops to a human-readable token amount. */
export function fromStroops(stroops: bigint): number {
  return Number(stroops) / 10_000_000;
}

// ── Client stub ───────────────────────────────────────────────────────────────

export class VaultClient {
  constructor(
    private readonly contractId: string,
    private readonly rpcUrl: string,
    private readonly networkPassphrase: string,
  ) {}

  /** Read the current vault configuration (signers + threshold). */
  async getConfig(): Promise<VaultConfig> {
    throw new Error("Not implemented — see Issue #8");
  }

  /** Read a proposal by ID. */
  async getProposal(proposalId: number): Promise<Proposal> {
    throw new Error("Not implemented — see Issue #8");
  }

  /** Read the total number of proposals ever created. */
  async getProposalCount(): Promise<number> {
    throw new Error("Not implemented — see Issue #8");
  }

  /** Check if an address is a current vault signer. */
  async isSignerCheck(address: string): Promise<boolean> {
    throw new Error("Not implemented — see Issue #8");
  }

  /**
   * Propose a token transfer.
   * @returns The new proposal ID.
   */
  async proposeTransfer(
    proposer: string,
    token: string,
    recipient: string,
    amount: bigint,
    description: string,
  ): Promise<number> {
    throw new Error("Not implemented — see Issue #8");
  }

  /**
   * Propose adding a new signer.
   * @returns The new proposal ID.
   */
  async proposeAddSigner(
    proposer: string,
    newSigner: string,
    description: string,
  ): Promise<number> {
    throw new Error("Not implemented — see Issue #8");
  }

  /**
   * Propose removing a signer.
   * @returns The new proposal ID.
   */
  async proposeRemoveSigner(
    proposer: string,
    signerToRemove: string,
    description: string,
  ): Promise<number> {
    throw new Error("Not implemented — see Issue #8");
  }

  /**
   * Approve a pending proposal.
   * @returns The updated ProposalStatus.
   */
  async approve(signer: string, proposalId: number): Promise<ProposalStatus> {
    throw new Error("Not implemented — see Issue #8");
  }

  /** Reject a pending proposal. */
  async reject(signer: string, proposalId: number): Promise<void> {
    throw new Error("Not implemented — see Issue #8");
  }

  /** Execute an approved proposal. Anyone can call this. */
  async execute(proposalId: number): Promise<void> {
    throw new Error("Not implemented — see Issue #8");
  }
}
