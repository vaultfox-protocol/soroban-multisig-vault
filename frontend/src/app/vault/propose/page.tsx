"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type ProposalType = "transfer" | "add_signer" | "remove_signer";

export default function ProposePage() {
  const [proposalType, setProposalType] = useState<ProposalType>("transfer");
  const [recipient, setRecipient] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [targetSigner, setTargetSigner] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(`Proposal created successfully! Proposal ID: 1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create Proposal</h1>
        <p className="text-gray-400 mt-2">Submit a governance proposal for vault signers to approve.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
        {/* Proposal type selector */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Proposal type</label>
          <div className="grid grid-cols-3 gap-2">
            {(["transfer", "add_signer", "remove_signer"] as ProposalType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setProposalType(t)}
                className={clsx(
                  "py-2 px-3 rounded-lg text-xs font-medium border transition-colors",
                  proposalType === t
                    ? "bg-emerald-900/50 border-emerald-600 text-emerald-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                )}
              >
                {t === "transfer" ? "Transfer" : t === "add_signer" ? "Add Signer" : "Remove Signer"}
              </button>
            ))}
          </div>
        </div>

        {/* Transfer fields */}
        {proposalType === "transfer" && (
          <>
            <div>
              <label htmlFor="recipient" className="block text-sm text-gray-400 mb-1">Recipient address</label>
              <input id="recipient" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)}
                placeholder="G..." required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="token" className="block text-sm text-gray-400 mb-1">Token contract (SEP-0041)</label>
              <input id="token" type="text" value={token} onChange={(e) => setToken(e.target.value)}
                placeholder="C..." required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm text-gray-400 mb-1">Amount</label>
              <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="100" min="0.0000001" step="any" required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
          </>
        )}

        {/* Signer fields */}
        {(proposalType === "add_signer" || proposalType === "remove_signer") && (
          <div>
            <label htmlFor="target" className="block text-sm text-gray-400 mb-1">
              {proposalType === "add_signer" ? "New signer address" : "Signer to remove"}
            </label>
            <input id="target" type="text" value={targetSigner} onChange={(e) => setTargetSigner(e.target.value)}
              placeholder="G..." required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500" />
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
            rows={3} placeholder="Why are you proposing this?"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none" />
        </div>

        {error && <div role="alert" className="p-4 bg-red-950 border border-red-800 rounded-lg text-red-300 text-sm">{error}</div>}
        {success && <div role="status" className="p-4 bg-green-950 border border-green-800 rounded-lg text-green-300 text-sm">{success}</div>}

        <button type="submit" disabled={isSubmitting}
          className={clsx("w-full py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2",
            isSubmitting ? "bg-gray-700 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500")}>
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Submitting…" : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}
