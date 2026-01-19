import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import EthLogo from '@/components/EthLogo';
import { publicClient } from '@/lib/ethereum';

export const revalidate = 12;

export default async function Home() {
  const latestBlock = await publicClient.getBlockNumber();

  return (
    <main className="min-h-screen bg-[#202124] flex flex-col">
      {/* Main content - centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <EthLogo className="w-24 h-24" />
          <span className="text-6xl font-normal text-white tracking-tight">net</span>
        </div>

        {/* Search Bar */}
        <SearchBar showSuggestions />
      </div>

      {/* Footer */}
      <footer className="bg-[#171717] text-[#9aa0a6] text-sm">
        <div className="px-8 py-3 border-b border-[#3c4043]">
          <span>Ethereum Mainnet</span>
        </div>
        <div className="px-8 py-3 flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex gap-6">
            <Link href="/blocks" className="hover:underline">
              Blocks
            </Link>
            <Link href="/transactions" className="hover:underline">
              Transactions
            </Link>
            <Link href="/addresses" className="hover:underline">
              Addresses
            </Link>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
