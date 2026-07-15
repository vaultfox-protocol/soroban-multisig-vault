"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react";
import clsx from "clsx";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VaultConfig {
  signers: string[];
  threshold: number;
}

interface RecentProposal {
  id: number;
  type: string;
  description: string;
  status: "Pending" | "Approved" | "Executed" | "Cancelled";
  approvals: number;
  threshold: number;
}

// ── Mock data (replace with live contract reads in Issue #3) ──────────────────

const MOCK_CONFIG: VaultConfig = {
  signers: [
    "GBXF7TXYEJQ7XFMB2WTBKBHXBJLV5SVXJYYFXNBSIVBUXQZ3M6I4TIA",
    "GDNVWKMFZJ4QEAGQZQXMRQN3ZQKJFGZ6LTWXZQCJSXM4KPQZQ3TUHJ",
    "GCEXAMPLEADDRESSTHREE4XMRQN3ZQKJFGZ6LTWXZQCJSXM4KPQZABCD",
  ],
  threshold: 2,
};

const MOCK_RECENT: RecentProposal[] = [
  { id: 4, type: "Transfer", description: "Pay dev team — Sprint 3", approvals: 1, threshold: 2, status: "Pending" },
  { id: 3, type: "AddSigner", description: "Add alice as vault signer", approvals: 2, threshold: 2, status: "Executed" },
  { id: 2, type: "Transfer", description: "Reimburse infra costs May", approvals: 2, threshold: 2, status: "Executed" },
  { id: 1, type: "Transfer", description: "Initial contributor payment", approvals: 2, threshold: 2, status: "Executed" },
];

// ── Status helpers ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Pending:   "text-yellow-300 bg-yellow-900/30 border-yellow-700",
  Approved:  "text-blue-300 bg-blue-900/30 border-blue-700",
  Executed:  "text-green-300 bg-green-900/30 border-green-700",
  Cancelled: "text-red-300 bg-red-900/30 border-red-700",
};

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VaultDashboardPage() {
  const [config, setConfig] = useState<VaultConfig | null>(null);
  const [recent, setRecent] = useState<RecentProposal[]>([]);
  const [proposalCount, setProposalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO (Issue #3): Replace with live get_config + get_proposal_count calls
    const timer = setTimeout(() => {
      setConfig(MOCK_CONFIG);
      setRecent(MOCK_RECENT);
      setProposalCount(4);
      setPendingCount(1);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const contractId = process.env.NEXT_PUBLIC_VAULT_CONTRACT_ID ?? "CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52";

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vault Dashboard</h1>
          <p className="text-gray-400 mt-2">On-chain state of your MultiSig Vault.</p>
        </div>
        <Link
          href="/vault/propose"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors"
        >
          + New Proposal
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Signers",          value: loading ? "—" : config?.signers.length, icon: <Users className="w-5 h-5 text-emerald-400" /> },
          { label: "Threshold",        value: loading ? "—" : `${config?.threshold} of ${config?.signers.length}`, icon: <CheckCircle className="w-5 h-5 text-blue-400" /> },
          { label: "Pending",          value: loading ? "—" : pendingCount,  icon: <Clock className="w-5 h-5 text-yellow-400" /> },
          { label: "Total Proposals",  value: loading ? "—" : proposalCount, icon: <AlertCircle className="w-5 h-5 text-gray-400" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card flex items-center gap-4">
            {icon}
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Signers */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Signers
        </h2>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-8 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {config?.signers.map((s, i) => (
              <li key={s} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-300 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="font-mono text-gray-300 hidden sm:block">{s}</span>
                  <span className="font-mono text-gray-300 sm:hidden">{truncate(s)}</span>
                </div>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${s}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300"
                  aria-label={`View ${truncate(s)} on Stellar Expert`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent proposals */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Proposals</h2>
          <Link href="/vault/proposals" className="text-emerald-400 hover:text-emerald-300 text-sm">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No proposals yet.</p>
        ) : (
          <ul className="divide-y divide-gray-800">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/vault/proposals/${p.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-800/50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 font-mono w-6">#{p.id}</span>
                    <span className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{p.type}</span>
                    <span className="text-sm text-gray-300 truncate max-w-xs">{p.description}</span>
                  </div>
                  <span className={clsx("px-2.5 py-0.5 rounded-full border text-xs font-semibold shrink-0", STATUS_COLORS[p.status])}>
                    {p.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Contract info */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">Contract</h2>
        <p className="font-mono text-xs text-gray-500 break-all">{contractId}</p>
        <a
          href={`https://stellar.expert/explorer/testnet/contract/${contractId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 text-xs mt-2 inline-flex items-center gap-1 hover:underline"
        >
          View on Stellar Expert <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
}
