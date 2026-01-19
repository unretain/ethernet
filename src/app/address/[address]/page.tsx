import Link from 'next/link';
import { getAddressInfo, formatEther, publicClient } from '@/lib/ethereum';
import { notFound } from 'next/navigation';
import SearchHeader from '@/components/SearchHeader';
import EthLogo from '@/components/EthLogo';

interface AddressPageProps {
  params: Promise<{ address: string }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    notFound();
  }

  try {
    const info = await getAddressInfo(address as `0x${string}`);
    const code = await publicClient.getCode({ address: address as `0x${string}` });
    const isContract = code && code !== '0x';

    return (
      <main className="min-h-screen bg-[#202124]">
        <SearchHeader initialQuery={address} />

        {/* Results area */}
        <div className="max-w-[652px] px-4 py-4" style={{ marginLeft: '180px' }}>

          {/* Main Address Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Ethernet</span>
                <span className="text-xs text-[#9aa0a6]">https://ethernet.io › address › {address.slice(0, 12)}...</span>
              </div>
              <button className="ml-1 text-[#9aa0a6]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>

            <h1 className="text-xl text-[#8ab4f8] hover:underline cursor-pointer mb-2">
              {isContract ? 'Contract' : 'Address'}: {address.slice(0, 10)}...{address.slice(-8)}
            </h1>

            <p className="text-sm text-[#bdc1c6] leading-6">
              <span className="text-[#9aa0a6]">{isContract ? 'Smart Contract' : 'Externally Owned Account'}</span> —
              Balance: <strong className="text-[#bdc1c6]">{parseFloat(formatEther(info.balance)).toFixed(4)} ETH</strong>.
              Total transactions: {info.transactionCount.toLocaleString()}.
              {isContract && ' This address contains deployed contract code.'}
            </p>
          </article>

          {/* Balance Card Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center">
                <span className="text-sm">Ξ</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Balance</span>
                <span className="text-xs text-[#9aa0a6]">ethereum › mainnet</span>
              </div>
            </div>
            <h2 className="text-xl text-[#8ab4f8] mb-2">
              {parseFloat(formatEther(info.balance)).toFixed(8)} ETH
            </h2>
            <p className="text-sm text-[#bdc1c6] leading-6">
              Current ETH balance for this {isContract ? 'contract' : 'address'} on Ethereum Mainnet.
              This balance can change with each new transaction.
            </p>
          </article>

          {/* Transaction Count Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center">
                <span className="text-xs text-[#9aa0a6]">#</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Transactions</span>
                <span className="text-xs text-[#9aa0a6]">nonce count</span>
              </div>
            </div>
            <h2 className="text-xl text-[#8ab4f8] mb-2">
              {info.transactionCount.toLocaleString()} Transactions
            </h2>
            <p className="text-sm text-[#bdc1c6] leading-6">
              Total number of outgoing transactions from this {isContract ? 'contract' : 'address'}.
              {!isContract && ' Also known as the nonce - increments with each transaction sent.'}
            </p>
          </article>

          {/* Account Type Result */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center">
                <span className="text-xs text-[#9aa0a6]">{isContract ? '📄' : '👤'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Account Type</span>
                <span className="text-xs text-[#9aa0a6]">ethereum account classification</span>
              </div>
            </div>
            <h2 className="text-xl text-[#8ab4f8] mb-2">
              {isContract ? 'Smart Contract' : 'EOA (Externally Owned Account)'}
            </h2>
            <p className="text-sm text-[#bdc1c6] leading-6">
              {isContract ? (
                <>This address is a <strong className="text-[#bdc1c6]">smart contract</strong> with deployed bytecode. It can hold funds and execute programmed logic when called.</>
              ) : (
                <>This is an <strong className="text-[#bdc1c6]">externally owned account</strong> controlled by a private key. It can send transactions and hold ETH.</>
              )}
            </p>
          </article>

          {/* Full Address */}
          <article className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-7 h-7 rounded-full bg-[#303134] flex items-center justify-center overflow-hidden">
                <EthLogo className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#bdc1c6]">Full Address</span>
                <span className="text-xs text-[#9aa0a6]">click to copy</span>
              </div>
            </div>
            <p className="text-sm text-[#8ab4f8] font-mono break-all">
              {address}
            </p>
          </article>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
