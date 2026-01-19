'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EthLogo from './EthLogo';
import { detectSearchType } from '@/lib/utils';

interface SearchHeaderProps {
  initialQuery?: string;
}

export default function SearchHeader({ initialQuery = '' }: SearchHeaderProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const type = detectSearchType(query);
    if (!type) return;

    switch (type) {
      case 'block':
        router.push(`/block/${query}`);
        break;
      case 'tx':
        router.push(`/tx/${query}`);
        break;
      case 'address':
        router.push(`/address/${query}`);
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#202124] border-b border-[#3c4043]">
      <div className="flex items-center gap-6 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <EthLogo className="w-8 h-8" />
          <span className="text-xl text-white">net</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[692px]">
          <div
            className={`flex items-center px-4 py-2 rounded-full border bg-[#303134] transition-all ${
              isFocused
                ? 'border-[#5f6368] shadow-[0_1px_6px_rgba(32,33,36,0.28)]'
                : 'border-transparent hover:bg-[#3c4043]'
            }`}
          >
            <svg className="w-5 h-5 text-[#9aa0a6] mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-white text-base outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-[#9aa0a6] hover:text-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
