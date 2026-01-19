import Link from 'next/link';
import { getTransaction, formatEther, formatGwei } from '@/lib/ethereum';
import { shortenAddress } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

interface TransactionPageProps {
  params: Promise<{ hash: string }>;
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { hash } = await params;

  try {
    const { tx, receipt } = await getTransaction(hash as `0x${string}`);

    if (!tx) {
      notFound();
    }

    const status = receipt?.status === 'success';
    const fee = receipt ? formatEther(receipt.gasUsed * receipt.effectiveGasPrice) : '0';

    return (
      <main className="min-h-screen bg-[#202124]">
        <SearchHeader initialQuery={hash} />

        {/* Results area */}
        <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>

          {/* Main Transaction Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › tx › {hash.slice(0, 20)}...</span>
              </div>
              <button className="ml-1 text-[#9aa0a6]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>

            <h1 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer mb-2">
              Transaction {hash.slice(0, 18)}...{hash.slice(-8)} - {status ? 'Success' : 'Failed'}
            </h1>

            <p className="text-sm text-[#bdc1c6] leading-6">
              {status ? (
                <span className="text-green-400">✓ Confirmed</span>
              ) : (
                <span className="text-red-400">✗ Failed</span>
              )} —
              Transfer of <strong className="text-[#bdc1c6]">{formatEther(tx.value)} ETH</strong> from {shortenAddress(tx.from)} to {tx.to ? shortenAddress(tx.to) : 'Contract Creation'}.
              Fee: {parseFloat(fee).toFixed(6)} ETH.
              Block: #{tx.blockNumber?.toString()}.
            </p>
          </article>

          {/* From Address Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › address › {shortenAddress(tx.from)}</span>
              </div>
            </div>
            <Link href={`/address/${tx.from}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
              From: {tx.from}
            </Link>
            <p className="text-sm text-[#bdc1c6] leading-6">
              Sender address for this transaction. This account initiated the transfer
              and paid <strong className="text-[#bdc1c6]">{parseFloat(fee).toFixed(6)} ETH</strong> in transaction fees.
            </p>
          </article>

          {/* To Address Result */}
          {tx.to && (
            <article className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                  <EthLogo className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                  <span className="text-xs text-[#9aa0a6]">https://ethernet.io › address › {shortenAddress(tx.to)}</span>
                </div>
              </div>
              <Link href={`/address/${tx.to}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
                To: {tx.to}
              </Link>
              <p className="text-sm text-[#bdc1c6] leading-6">
                Recipient address for this transaction. This account received <strong className="text-[#bdc1c6]">{formatEther(tx.value)} ETH</strong>.
              </p>
            </article>
          )}

          {/* Block Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › block › {tx.blockNumber?.toString()}</span>
              </div>
            </div>
            <Link href={`/block/${tx.blockNumber}`} className="text-xl text-[#8ab4f8] hover:underline block mb-2">
              Block #{tx.blockNumber?.toString()}
            </Link>
            <p className="text-sm text-[#bdc1c6] leading-6">
              This transaction was included in block #{tx.blockNumber?.toString()}.
              Gas price: {tx.gasPrice ? formatGwei(tx.gasPrice) : '-'} Gwei.
              Gas used: {receipt?.gasUsed.toLocaleString() || '-'} / {tx.gas.toLocaleString()}.
            </p>
          </article>

          {/* Input Data if present */}
          {tx.input && tx.input !== '0x' && (
            <article className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center">
                  <span className="text-xs text-[#9aa0a6]">{ }</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-[#bdc1c6]">Input Data</span>
                  <span className="text-xs text-[#9aa0a6]">Contract interaction data</span>
                </div>
              </div>
              <h2 className="text-xl text-[#8ab4f8] mb-2">
                Contract Call Data
              </h2>
              <div className="bg-[#303134] rounded-lg p-3 mt-2">
                <p className="text-xs text-[#9aa0a6] font-mono break-all">
                  {tx.input.slice(0, 200)}{tx.input.length > 200 ? '...' : ''}
                </p>
              </div>
            </article>
          )}
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
