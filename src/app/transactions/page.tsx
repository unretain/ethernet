import Link from 'next/link';
import { publicClient, formatEther } from '@/lib/ethereum';
import { shortenAddress } from '@/lib/utils';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

export const revalidate = 12;

export default async function TransactionsPage() {
  // Get latest block with transactions
  const latestBlock = await publicClient.getBlock({ includeTransactions: true });
  const transactions = latestBlock.transactions.slice(0, 20);

  return (
    <main className="min-h-screen bg-[#202124]">
      <SearchHeader initialQuery="transactions" />

      <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>
        <p className="text-sm text-[#9aa0a6] mb-6">
          Showing {transactions.length} latest transactions from block #{latestBlock.number?.toString()}
        </p>

        {transactions.map((tx) => {
          if (typeof tx === 'string') return null;

          return (
            <article key={tx.hash} className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                  <EthLogo className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                  <span className="text-xs text-[#9aa0a6]">https://ethernet.io › tx › {tx.hash.slice(0, 16)}...</span>
                </div>
              </div>

              <Link href={`/tx/${tx.hash}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
                Transaction {tx.hash.slice(0, 18)}...{tx.hash.slice(-8)}
              </Link>

              <p className="text-sm text-[#bdc1c6] leading-6">
                Transfer of <strong className="text-[#bdc1c6]">{parseFloat(formatEther(tx.value)).toFixed(4)} ETH</strong> from {shortenAddress(tx.from)} to {tx.to ? shortenAddress(tx.to) : 'Contract Creation'}.
                Block #{latestBlock.number?.toString()}.
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}
