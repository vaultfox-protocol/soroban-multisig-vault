import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soroban MultiSig Vault",
  description: "M-of-N multi-signature treasury on Stellar. Propose, approve, and execute transfers with on-chain governance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-gray-50 min-h-screen">
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
          <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between h-16">
            <div className="font-bold text-lg flex items-center gap-2">
              <span className="text-emerald-400">⬡</span>
              <span>MultiSig Vault</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm text-gray-400">
              <a href="/vault" className="hover:text-white transition-colors">Dashboard</a>
              <a href="/vault/propose" className="hover:text-white transition-colors">Propose</a>
              <a href="/vault/proposals" className="hover:text-white transition-colors">Proposals</a>
            </nav>
            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">Stellar Testnet</span>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-5xl">{children}</main>
      </body>
    </html>
  );
}
