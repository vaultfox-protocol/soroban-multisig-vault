"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Play, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import clsx from "clsx";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProposalDetail {
  id: number;
  type: "Transfer" | "AddSigner" | "RemoveSigner" | "ChangeThreshold";
  description: string;
  proposer: string;
  recipient?: string;
  token?: string;
  amount?: number;
  targetSigner?: string;
  newThreshold?: number;
  approvals: string[];
  rejections: string[];
  threshold: number;
  totalSigners: number;
  status: "Pending" | "Approved" | "Executed" | "Cancelled";
  expiresAt: number;
  expiresIn: string;
}

// ── Mock data (replace with live get_proposal in Issue #4) ───────────────────

const MOCK_PROPOSALS: Record<number, ProposalDetail> = {
  1: {
    id: 1,
    type: "Transfer",
    description: "Initial contributor payment — 500 USDC for Q1 work",
    proposer: "GBXF7TXYEJQ7XFMB2WTBKBHXBJLV5SVXJYYFXNBSIVBUXQZ3M6I4TIA",
    recipient: "GDRECIPIENTADDRESSEXAMPLE4XMRQN3ZQKJFGZ6LTWXZQCJSXM4KPABCD",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    amount: 500,
    approvals: [
      "GBXF7TXYEJQ7XFMB2WTBKBHXBJLV5SVXJYYFXNBSIVBUXQZ3M6I4TIA",
      "GDNVWKMFZJ4QEAGQZQXMRQN3ZQKJFGZ6LTWXZQCJSXM4KPQZQ3TUHJ",
    ],
    rejections: [],
    threshold: 2,
    totalSigners: 3,
    status: "Executed",
    expiresAt: 0,
    expiresIn: "—",
  },
  4: {
    id: 4,
    type: "Transfer",
    description: "Pay dev team — Sprint 3 milestone completion",
    proposer: "GBXF7TXYEJQ7XFMB2WTBKBHXBJLV5SVXJYYFXNBSIVBUXQZ3M6I4TIA",
    recipient: "GDRECIPIENTADDRESSEXAMPLE4XMRQN3ZQKJFGZ6LTWXZQCJSXM4KPABCD",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    amount: 1000,
    approvals: ["GBXF7TXYEJQ7XFMB2WTBKBHXBJLV5SVXJYYFXNBSIVBUXQZ3M6I4TIA"],
    rejections: [],
    threshold: 2,
    totalSigners: 3,
    status: "Pending",
    expiresAt: 99999999,
    expiresIn: "6 days",
  },
};

// ── Status / type helpers ─────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Pending:   "text-yellow-300 bg-yellow-900/30 border-yellow-700",
  Approved:  "text-blue-300 bg-blue-900/30 border-blue-700",
  Executed:  "text-green-300 bg-green-900/30 border-green-700",
  Cancelled: "text-red-300 bg-red-900/30 border-red-700",
};

function truncate(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-8)}`;
}

function ExplorerLink({ address, label }: { address: string; label?: string }) {
  return (
    <a
      href={`https://stellar.expert/explorer/testnet/account/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs text-emerald-400 hover:underline flex items-center gap-1 break-all"
    >
      {label ?? truncate(address)}
      <ExternalLink className="w-3 h-3 shrink-0" />
    </a>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProposalDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [proposal, setProposal] = useState<ProposalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    // TODO (Issue #4): Replace with live get_proposal(id) contract call
    const timer = setTimeout(() => {
      setProposal(MOCK_PROPOSALS[id] ?? null);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const handleAction = async (action: "approve" | "reject" | "execute") => {
    setActionPending(true);
    setFeedback(null);
    try {
      // TODO (Issue #4): Wire to contract calls via Freighter
      await new Promise((r) => setTimeout(r, 1000));
      setFeedback({ type: "success", msg: `${action.charAt(0).toUpperCase() + action.slice(1)} submitted successfully.` });
    } catch (err) {
      setFeedback({ type: "error", msg: err instanceof Error ? err.message : "Transaction failed" });
    } finally {
      setActionPending(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 pt-8">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-400 text-lg">Proposal #{id} not found.</p>
        <Link href="/vault/proposals" className="text-emerald-400 mt-4 inline-block hover:underline">
          ← Back to proposals
        </Link>
      </div>
    );
  }

  const approvalPct = Math.min((proposal.approvals.length / proposal.threshold) * 100, 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Back */}
      <Link href="/vault/proposals" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        Back to proposals
      </Link>

      {/* Header */}
      <div className="card space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{proposal.type}</span>
              <span className="text-xs text-gray-600">#{proposal.id}</span>
            </div>
            <p className="text-gray-200 text-sm">{proposal.description}</p>
          </div>
          <span className={clsx("px-3 py-1 rounded-full border text-xs font-semibold shrink-0", STATUS_COLORS[proposal.status])}>
            {proposal.status}
          </span>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {proposal.status === "Pending" ? `Expires in ${proposal.expiresIn}` : "Closed"}
        </div>
      </div>

      {/* Proposal details */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Details</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500 text-xs mb-0.5">Proposed by</dt>
            <dd><ExplorerLink address={proposal.proposer} /></dd>
          </div>

          {proposal.type === "Transfer" && (
            <>
              <div>
                <dt className="text-gray-500 text-xs mb-0.5">Recipient</dt>
                <dd><ExplorerLink address={proposal.recipient!} /></dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs mb-0.5">Token contract</dt>
                <dd>
                  <a
                    href={`https://stellar.expert/explorer/testnet/contract/${proposal.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-emerald-400 hover:underline flex items-center gap-1 break-all"
                  >
                    {truncate(proposal.token!)}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 text-xs mb-0.5">Amount</dt>
                <dd className="font-semibold">{proposal.amount?.toLocaleString()} tokens</dd>
              </div>
            </>
          )}

          {(proposal.type === "AddSigner" || proposal.type === "RemoveSigner") && (
            <div>
              <dt className="text-gray-500 text-xs mb-0.5">
                {proposal.type === "AddSigner" ? "New signer" : "Signer to remove"}
              </dt>
              <dd><ExplorerLink address={proposal.targetSigner!} /></dd>
            </div>
          )}

          {proposal.type === "ChangeThreshold" && (
            <div>
              <dt className="text-gray-500 text-xs mb-0.5">New threshold</dt>
              <dd className="font-semibold">{proposal.newThreshold} of {proposal.totalSigners}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Approval progress */}
      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Votes</h2>

        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>{proposal.approvals.length} of {proposal.threshold} approvals needed</span>
            <span>{Math.round(approvalPct)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={clsx("h-2 rounded-full transition-all", approvalPct >= 100 ? "bg-emerald-400" : "bg-emerald-600")}
              style={{ width: `${approvalPct}%` }}
            />
          </div>
        </div>

        {proposal.approvals.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Approved by
            </p>
            <ul className="space-y-1">
              {proposal.approvals.map(a => (
                <li key={a}><ExplorerLink address={a} /></li>
              ))}
            </ul>
          </div>
        )}

        {proposal.rejections.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-red-400" /> Rejected by
            </p>
            <ul className="space-y-1">
              {proposal.rejections.map(r => (
                <li key={r}><ExplorerLink address={r} /></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={clsx(
            "p-4 rounded-lg text-sm border",
            feedback.type === "success"
              ? "bg-green-950 border-green-800 text-green-300"
              : "bg-red-950 border-red-800 text-red-300"
          )}
        >
          {feedback.msg}
        </div>
      )}

      {/* Actions */}
      {proposal.status === "Pending" && (
        <div className="flex gap-3">
          <button
            onClick={() => handleAction("approve")}
            disabled={actionPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => handleAction("reject")}
            disabled={actionPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-red-400 border border-red-900 rounded-lg text-sm font-medium transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {proposal.status === "Approved" && (
        <button
          onClick={() => handleAction("execute")}
          disabled={actionPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Execute
        </button>
      )}

    </div>
  );
}
