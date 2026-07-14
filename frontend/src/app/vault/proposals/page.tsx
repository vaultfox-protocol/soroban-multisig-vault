"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle, XCircle, Play } from "lucide-react";

interface ProposalDisplay {
  id: number;
  type: string;
  description: string;
  approvals: number;
  rejections: number;
  threshold: number;
  status: string;
  expires: string;
}

const MOCK_PROPOSALS: ProposalDisplay[] = [
  { id: 1, type: "Transfer", description: "Pay contributor 500 USDC for milestone 1", approvals: 1, rejections: 0, threshold: 2, status: "Pending", expires: "6 days" },
  { id: 2, type: "AddSigner", description: "Add alice as a new vault signer", approvals: 2, rejections: 0, threshold: 2, status: "Approved", expires: "5 days" },
  { id: 3, type: "Transfer", description: "Refund 100 USDC to client", approvals: 2, rejections: 0, threshold: 2, status: "Executed", expires: "—" },
];

const STATUS_COLORS: Record<string, string> = {
  Pending:  "text-yellow-300 bg-yellow-900/30 border-yellow-700",
  Approved: "text-blue-300 bg-blue-900/30 border-blue-700",
  Executed: "text-green-300 bg-green-900/30 border-green-700",
  Cancelled:"text-red-300 bg-red-900/30 border-red-700",
};

export default function ProposalsPage() {
  const [proposals] = useState(MOCK_PROPOSALS);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Proposals</h1>
        <p className="text-gray-400 mt-2">View and act on active vault proposals.</p>
      </div>

      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p.id} className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{p.type}</span>
                  <span className="text-xs text-gray-600">#{p.id}</span>
                </div>
                <p className="text-sm text-gray-300">{p.description}</p>
              </div>
              <span className={clsx("px-3 py-1 rounded-full border text-xs font-semibold shrink-0", STATUS_COLORS[p.status])}>
                {p.status}
              </span>
            </div>

            {/* Approval bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{p.approvals}/{p.threshold} approvals needed</span>
                <span>Expires in {p.expires}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min((p.approvals / p.threshold) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            {p.status === "Pending" && (
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-colors">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-red-400 border border-red-900 rounded-lg text-sm transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
            {p.status === "Approved" && (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors">
                <Play className="w-4 h-4" /> Execute
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
