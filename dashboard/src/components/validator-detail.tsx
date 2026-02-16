"use client";

import type { ValidatorData } from "@/lib/types";
import { resolveValidatorName } from "@/lib/validators";
import { IconKey, IconServer, IconShield } from "@/lib/icons";

interface ValidatorDetailProps {
  validator: ValidatorData;
  onClose: () => void;
}

function Row({ label, value, mono, href }: { label: string; value: string; mono?: boolean; href?: string }) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-[#141a2d]">
      <span className="text-[12px] text-[var(--muted)] tracking-widest shrink-0">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[13px] text-[var(--cyan)] text-right ml-4 break-all hover:underline ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </a>
      ) : (
        <span
          className={`text-[13px] text-[#c8c8d0] text-right ml-4 break-all ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export default function ValidatorDetail({ validator, onClose }: ValidatorDetailProps) {
  const name = resolveValidatorName(validator.validatorAddress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                validator.active
                  ? "bg-[var(--cyan)] live-dot"
                  : "bg-[var(--rose)]"
              }`}
            />
            <span className="text-base font-bold tracking-widest text-[var(--white)]">
              {name ?? `VALIDATOR #${validator.index}`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--white)] transition-colors text-sm tracking-widest px-2 py-1 border border-[var(--border)] rounded-sm hover:border-[#0f2a35]"
          >
            CLOSE
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-3 overflow-y-auto flex-1">
          <div className="flex items-center gap-2 mb-3">
            <IconShield className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[12px] tracking-widest text-[var(--muted)]">
              IDENTITY
            </span>
          </div>
          <Row label="INDEX" value={String(validator.index)} />
          <Row label="STATUS" value={validator.active ? "ACTIVE" : "INACTIVE"} />
          {name && <Row label="NAME" value={name} />}
          <Row
            label="ADDRESS"
            value={validator.validatorAddress}
            mono
            href={`https://explore.tempo.xyz/address/${validator.validatorAddress}`}
          />

          <div className="flex items-center gap-2 mt-5 mb-3">
            <IconKey className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[12px] tracking-widest text-[var(--muted)]">
              CONSENSUS KEY
            </span>
          </div>
          <Row label="ED25519 PUBLIC KEY" value={validator.publicKey} mono />

          <div className="flex items-center gap-2 mt-5 mb-3">
            <IconServer className="w-3.5 h-3.5 text-[var(--muted)]" />
            <span className="text-[12px] tracking-widest text-[var(--muted)]">
              NETWORK
            </span>
          </div>
          <Row label="INBOUND" value={validator.inboundAddress || "--"} mono />
          <Row label="OUTBOUND" value={validator.outboundAddress || "--"} mono />

          {/* Explorer links */}
          <div className="mt-5 flex flex-col gap-2">
            <a
              href={`https://explore.tempo.xyz/address/${validator.validatorAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
            >
              VIEW ADDRESS ON EXPLORER
            </a>
            <a
              href="https://explore.tempo.xyz/validators"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--cyan)] tracking-widest hover:underline"
            >
              VIEW ALL VALIDATORS
            </a>
            <a
              href="https://explore.tempo.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-[var(--muted)] tracking-widest hover:text-[var(--cyan)] transition-colors"
            >
              TEMPO EXPLORER HOME
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
