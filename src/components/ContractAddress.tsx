'use client';

import { useState } from 'react';

const CONTRACT_ADDRESS = '2f4YSx72uj8Av1wE3AmvdWQHiBSVoUefw6Syka5rpump';

export default function ContractAddress() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <button
      onClick={copy}
      title="Click to copy contract address"
      className="mt-8 flex items-center gap-3 max-w-full px-4 py-2 rounded-full bg-[#303134] border border-[#5f6368] hover:border-[#8ab4f8] transition-colors group"
    >
      <span className="text-xs font-semibold tracking-wide text-[#9aa0a6] group-hover:text-[#8ab4f8] shrink-0">
        CA
      </span>
      <span className="font-mono text-sm text-[#bdc1c6] truncate">
        {CONTRACT_ADDRESS}
      </span>
      <span className="text-xs text-[#9aa0a6] group-hover:text-[#8ab4f8] shrink-0">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}
