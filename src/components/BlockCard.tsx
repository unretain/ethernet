import Link from 'next/link';
import { formatTimeAgo, shortenHash } from '@/lib/utils';
import type { Block } from 'viem';

interface BlockCardProps {
  block: Block;
}

export default function BlockCard({ block }: BlockCardProps) {
  return (
    <Link
      href={`/block/${block.number}`}
      className="block p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors bg-white dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              Block
            </span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
              {block.number?.toString()}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {block.transactions.length} txns
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatTimeAgo(block.timestamp)}
          </p>
          <p className="mt-1 text-xs font-mono text-zinc-400 dark:text-zinc-500">
            {shortenHash(block.hash || '', 6)}
          </p>
        </div>
      </div>
    </Link>
  );
}
