import Link from 'next/link';
import { formatEther } from '@/lib/ethereum';
import { shortenHash, shortenAddress, formatTimeAgo } from '@/lib/utils';
import type { Transaction } from 'viem';

interface TransactionRowProps {
  tx: Transaction;
  timestamp?: bigint;
}

export default function TransactionRow({ tx, timestamp }: TransactionRowProps) {
  return (
    <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex-1">
          <Link
            href={`/tx/${tx.hash}`}
            className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {shortenHash(tx.hash, 10)}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>From</span>
            <Link
              href={`/address/${tx.from}`}
              className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {shortenAddress(tx.from)}
            </Link>
            <span>→</span>
            {tx.to ? (
              <Link
                href={`/address/${tx.to}`}
                className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {shortenAddress(tx.to)}
              </Link>
            ) : (
              <span className="text-zinc-400">Contract Creation</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {parseFloat(formatEther(tx.value)).toFixed(4)} ETH
          </p>
          {timestamp && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatTimeAgo(timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
