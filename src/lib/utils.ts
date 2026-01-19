export function formatTimestamp(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

export function formatTimeAgo(timestamp: bigint): string {
  const seconds = Math.floor(Date.now() / 1000) - Number(timestamp);

  if (seconds < 60) return `${seconds} secs ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

export function shortenHash(hash: string, chars: number = 8): string {
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function detectSearchType(query: string): 'block' | 'tx' | 'address' | null {
  const trimmed = query.trim();

  // Block number (numeric)
  if (/^\d+$/.test(trimmed)) {
    return 'block';
  }

  // Transaction hash (0x + 64 hex chars)
  if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
    return 'tx';
  }

  // Address (0x + 40 hex chars)
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    return 'address';
  }

  return null;
}
