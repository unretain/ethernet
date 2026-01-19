import Link from 'next/link';
import { publicClient, formatEther } from '@/lib/ethereum';
import { shortenAddress } from '@/lib/utils';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

export const revalidate = 12;

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    min?: string;
    max?: string;
    exact?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const minValue = params.min ? parseFloat(params.min) : undefined;
  const maxValue = params.max ? parseFloat(params.max) : undefined;
  const exactValue = params.exact ? parseFloat(params.exact) : undefined;

  // Scan recent blocks for transactions matching criteria
  const latestBlockNumber = await publicClient.getBlockNumber();
  const blocksToScan = 5; // Scan last 5 blocks

  const matchingTxs: Array<{
    hash: string;
    from: string;
    to: string | null;
    value: bigint;
    blockNumber: bigint;
  }> = [];

  for (let i = 0; i < blocksToScan && matchingTxs.length < 20; i++) {
    const blockNumber = latestBlockNumber - BigInt(i);
    const block = await publicClient.getBlock({
      blockNumber,
      includeTransactions: true
    });

    for (const tx of block.transactions) {
      if (typeof tx === 'string') continue;

      const valueInEth = parseFloat(formatEther(tx.value));

      let matches = false;

      if (exactValue !== undefined) {
        // Allow small tolerance for exact matches
        matches = Math.abs(valueInEth - exactValue) < 0.01;
      } else if (minValue !== undefined && maxValue !== undefined) {
        matches = valueInEth >= minValue && valueInEth <= maxValue;
      } else if (minValue !== undefined) {
        matches = valueInEth >= minValue;
      } else if (maxValue !== undefined) {
        matches = valueInEth <= maxValue;
      }

      if (matches && matchingTxs.length < 20) {
        matchingTxs.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          blockNumber: block.number!,
        });
      }
    }
  }

  const filterDescription = exactValue
    ? `exactly ${exactValue} ETH`
    : minValue && maxValue
      ? `between ${minValue} and ${maxValue} ETH`
      : minValue
        ? `over ${minValue} ETH`
        : maxValue
          ? `under ${maxValue} ETH`
          : 'matching your criteria';

  return (
    <main className="min-h-screen bg-[#202124]">
      <SearchHeader initialQuery={query} />

      <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>
        <p className="text-sm text-[#9aa0a6] mb-6">
          Found {matchingTxs.length} transactions {filterDescription} in the last {blocksToScan} blocks
        </p>

        {matchingTxs.length === 0 ? (
          <div className="text-[#9aa0a6] py-8">
            <p>No transactions found matching your criteria in recent blocks.</p>
            <p className="mt-2 text-sm">Try adjusting your search or check back later for new transactions.</p>
          </div>
        ) : (
          matchingTxs.map((tx) => (
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
                Transfer of <strong className="text-[#8ab4f8]">{parseFloat(formatEther(tx.value)).toFixed(4)} ETH</strong> from {shortenAddress(tx.from)} to {tx.to ? shortenAddress(tx.to) : 'Contract Creation'}.
                Block #{tx.blockNumber.toString()}.
              </p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
