import Link from 'next/link';
import { getLatestBlocks, formatEther } from '@/lib/ethereum';
import { formatTimeAgo, shortenAddress } from '@/lib/utils';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

export const revalidate = 12;

export default async function BlocksPage() {
  const blocks = await getLatestBlocks(20);

  return (
    <main className="min-h-screen bg-[#202124]">
      <SearchHeader initialQuery="blocks" />

      <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>
        <p className="text-sm text-[#9aa0a6] mb-6">
          Showing {blocks.length} latest blocks on Ethereum Mainnet
        </p>

        {blocks.map((block) => (
          <article key={block.number?.toString()} className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › block › {block.number?.toString()}</span>
              </div>
            </div>

            <Link href={`/block/${block.number}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
              Block #{block.number?.toString()}
            </Link>

            <p className="text-sm text-[#bdc1c6] leading-6">
              <span className="text-[#9aa0a6]">{formatTimeAgo(block.timestamp)}</span> —
              <strong className="text-[#bdc1c6]"> {block.transactions.length} transactions</strong>.
              Fee recipient: {shortenAddress(block.miner)}.
              Gas: {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}% used.
              {block.baseFeePerGas && ` Base fee: ${(Number(block.baseFeePerGas) / 1e9).toFixed(2)} Gwei.`}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
