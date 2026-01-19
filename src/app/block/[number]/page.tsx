import Link from 'next/link';
import { getBlock, formatEther } from '@/lib/ethereum';
import { formatTimeAgo, shortenAddress } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

interface BlockPageProps {
  params: Promise<{ number: string }>;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { number } = await params;

  try {
    const block = await getBlock(BigInt(number));

    if (!block) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-[#202124]">
        <SearchHeader initialQuery={number} />

        {/* Results area - matches Google's layout */}
        <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>

          {/* Main Block Result */}
          <article className="mb-8">
            {/* Site info row */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › block › {number}</span>
              </div>
              <button className="ml-1 text-[#9aa0a6]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer mb-2">
              Block #{block.number?.toString()} - Ethereum Block Explorer
            </h1>

            {/* Description */}
            <p className="text-sm text-[#bdc1c6] leading-6">
              <span className="text-[#9aa0a6]">{formatTimeAgo(block.timestamp)}</span> —
              This block contains <strong className="text-[#bdc1c6]">{block.transactions.length} transactions</strong>.
              Fee recipient: {shortenAddress(block.miner)}.
              Gas used: {block.gasUsed.toLocaleString()} ({((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}%).
              {block.baseFeePerGas && ` Base fee: ${(Number(block.baseFeePerGas) / 1e9).toFixed(2)} Gwei.`}
            </p>
          </article>

          {/* Fee Recipient Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › address › {shortenAddress(block.miner)}</span>
              </div>
            </div>
            <Link href={`/address/${block.miner}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
              Fee Recipient - {shortenAddress(block.miner)}
            </Link>
            <p className="text-sm text-[#bdc1c6] leading-6">
              View the <strong className="text-[#bdc1c6]">fee recipient address</strong> for Block #{number}.
              This validator/miner received the transaction fees from all {block.transactions.length} transactions in this block.
            </p>
          </article>

          {/* Transaction Results */}
          <h2 className="text-[#9aa0a6] text-sm mb-4">Transactions in this block</h2>

          {block.transactions.slice(0, 10).map((tx) => {
            const txData = typeof tx === 'string' ? null : tx;
            const txHash = typeof tx === 'string' ? tx : tx.hash;

            return (
              <article key={txHash} className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                    <EthLogo className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                    <span className="text-xs text-[#9aa0a6]">https://ethernet.io › tx › {txHash.slice(0, 16)}...</span>
                  </div>
                </div>
                <Link href={`/tx/${txHash}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
                  Transaction {txHash.slice(0, 18)}...{txHash.slice(-8)}
                </Link>
                <p className="text-sm text-[#bdc1c6] leading-6">
                  {txData ? (
                    <>
                      Transfer of <strong className="text-[#bdc1c6]">{parseFloat(formatEther(txData.value)).toFixed(4)} ETH</strong> from {shortenAddress(txData.from)} to {txData.to ? shortenAddress(txData.to) : 'Contract Creation'}.
                      Included in block #{number}.
                    </>
                  ) : (
                    <>Transaction included in block #{number}. Click to view full details.</>
                  )}
                </p>
              </article>
            );
          })}

          {block.transactions.length > 10 && (
            <p className="text-[#8ab4f8] text-sm cursor-pointer hover:underline">
              View all {block.transactions.length} transactions →
            </p>
          )}
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
