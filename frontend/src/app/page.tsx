import Link from "next/link";

const features = [
  { icon: "🔐", title: "M-of-N Threshold", desc: "Require any number of approvals before funds move. Configure 2-of-3, 3-of-5, or any combination." },
  { icon: "📋", title: "On-chain Proposals", desc: "Every transfer, signer change, and threshold update is a transparent, auditable proposal on Stellar." },
  { icon: "⏱️", title: "Time-locked Proposals", desc: "Proposals expire after 7 days, preventing stale approvals from executing unexpectedly." },
  { icon: "🗳️", title: "Approve or Reject", desc: "Any signer can approve or reject. Once enough rejections are cast, the proposal is automatically cancelled." },
  { icon: "👥", title: "Governance Actions", desc: "Add or remove signers and change the threshold — all through the same proposal system." },
  { icon: "⚡", title: "Permissionless Execute", desc: "Once the threshold is met, anyone can trigger execution — no single point of failure." },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-700 rounded-full text-emerald-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live on Stellar Testnet
        </div>
        <h1 className="text-5xl font-bold tracking-tight">
          Multi-Sig Treasury
          <span className="text-emerald-400"> on Stellar</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          M-of-N multi-signature vault powered by Soroban. The standard treasury primitive for DAOs, teams, and protocols on Stellar.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/vault/propose" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">
            Create Proposal
          </Link>
          <Link href="/vault/proposals" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
            View Proposals
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="card flex gap-4">
            <div className="text-2xl">{icon}</div>
            <div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Deployed Contract</h2>
        <p className="text-xs text-gray-500 font-mono break-all">
          CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52
        </p>
        <a
          href="https://stellar.expert/explorer/testnet/contract/CACONTTNI7XHW4YHKOQ7GULNIMUVZNQ5STDDADMESCSUGK2NMMHC3Q52"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 text-sm mt-2 inline-block hover:underline"
        >
          View on Stellar Expert →
        </a>
      </section>
    </div>
  );
}
