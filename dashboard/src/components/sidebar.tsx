"use client";

import {
  IconHome,
  IconCube,
  IconBolt,
  IconShield,
  IconChart,
  IconArrowPath,
  IconGlobe,
} from "@/lib/icons";

export type View =
  | "overview"
  | "blocks"
  | "transactions"
  | "validators"
  | "network"
  | "epochs";

interface SidebarProps {
  active: View;
  onChange: (view: View) => void;
  connected: boolean;
}

const NAV_ITEMS: { id: View; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: "overview", label: "OVERVIEW", icon: IconHome },
  { id: "blocks", label: "BLOCKS", icon: IconCube },
  { id: "transactions", label: "TRANSACTIONS", icon: IconBolt },
  { id: "validators", label: "VALIDATORS", icon: IconShield },
  { id: "network", label: "NETWORK", icon: IconChart },
  { id: "epochs", label: "EPOCHS", icon: IconArrowPath },
];

const LINKS: { label: string; href: string }[] = [
  { label: "EXPLORER", href: "https://explore.tempo.xyz" },
  { label: "DOCS", href: "https://docs.tempo.xyz" },
  { label: "GITHUB", href: "https://github.com/tempoxyz/tempo" },
];

export default function Sidebar({ active, onChange, connected }: SidebarProps) {
  return (
    <aside className="w-[200px] shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-[#0c1a2a] flex items-center justify-center">
            <IconCube className="w-4 h-4 text-[var(--cyan)]" />
          </div>
          <div>
            <div className="text-[13px] font-bold tracking-widest text-[var(--white)] leading-none">
              TEMPO
            </div>
            <div className="text-[11px] text-[var(--muted)] tracking-[0.15em] mt-0.5">
              MODERATO TESTNET
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-3 px-2">
        <div className="text-[11px] text-[var(--muted)] tracking-[0.2em] px-3 mb-2">
          NAVIGATION
        </div>
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm text-[12px] font-medium tracking-wider transition-colors w-full text-left ${
                  isActive
                    ? "bg-[#0c1a2a] text-[var(--cyan)] border border-[#0f2a35]"
                    : "text-[var(--muted)] hover:text-[var(--white)] hover:bg-[#0d1220] border border-transparent"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[var(--cyan)]" : ""}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-[var(--muted)] tracking-[0.2em] px-3 mt-5 mb-2">
          EXTERNAL
        </div>
        <div className="flex flex-col gap-0.5">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-[12px] font-medium tracking-wider text-[var(--muted)] hover:text-[var(--cyan)] transition-colors border border-transparent"
            >
              <IconGlobe className="w-4 h-4 shrink-0" />
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Status */}
      <div className="shrink-0 border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              connected ? "bg-[var(--cyan)] live-dot" : "bg-[var(--rose)]"
            }`}
          />
          <span className="text-[11px] text-[var(--muted)] tracking-widest">
            {connected ? "WSS LIVE" : "DISCONNECTED"}
          </span>
        </div>
        <div className="text-[11px] text-[var(--muted)] tracking-[0.15em]">
          CHAIN ID 42431
        </div>
        <a
          href="https://github.com/HedgeQuantX"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[var(--cyan)] tracking-[0.15em] hover:underline mt-1 inline-block"
        >
          HEDGEQUANTX
        </a>
      </div>
    </aside>
  );
}
