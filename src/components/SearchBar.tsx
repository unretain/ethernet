'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { detectSearchType } from '@/lib/utils';

const SUGGESTED_SEARCHES = [
  { label: 'Large transactions', query: 'transactions over 10 eth' },
  { label: 'Whale moves', query: 'transactions over 100 eth' },
  { label: 'vitalik.eth', query: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
  { label: 'Latest blocks', query: 'blocks' },
  { label: 'Rich list', query: 'addresses' },
];

// Parse natural language queries
function parseNaturalQuery(query: string): { type: string; params: Record<string, unknown> } | null {
  const lower = query.toLowerCase().trim();

  // "transactions over X eth" or "tx over X eth"
  const overMatch = lower.match(/(?:transactions?|txs?)\s+(?:over|above|greater than|>)\s+(\d+(?:\.\d+)?)\s*(?:eth)?/);
  if (overMatch) {
    return { type: 'tx_filter', params: { minValue: parseFloat(overMatch[1]) } };
  }

  // "transactions under X eth" or "tx under X eth"
  const underMatch = lower.match(/(?:transactions?|txs?)\s+(?:under|below|less than|<)\s+(\d+(?:\.\d+)?)\s*(?:eth)?/);
  if (underMatch) {
    return { type: 'tx_filter', params: { maxValue: parseFloat(underMatch[1]) } };
  }

  // "X eth transaction" or "X eth tx"
  const exactMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:eth)?\s+(?:transactions?|txs?)/);
  if (exactMatch) {
    return { type: 'tx_filter', params: { exactValue: parseFloat(exactMatch[1]) } };
  }

  // "large transactions" or "whale transactions"
  if (lower.includes('large') && (lower.includes('transaction') || lower.includes('tx'))) {
    return { type: 'tx_filter', params: { minValue: 10 } };
  }
  if (lower.includes('whale') && (lower.includes('transaction') || lower.includes('tx') || lower.includes('move'))) {
    return { type: 'tx_filter', params: { minValue: 100 } };
  }

  return null;
}

interface SearchBarProps {
  showSuggestions?: boolean;
}

export default function SearchBar({ showSuggestions = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    setError('');

    const trimmed = q.trim().toLowerCase();

    // Handle keyword searches
    if (trimmed === 'transactions' || trimmed === 'txs' || trimmed === 'tx') {
      router.push('/transactions');
      return;
    }
    if (trimmed === 'blocks' || trimmed === 'block') {
      router.push('/blocks');
      return;
    }
    if (trimmed === 'addresses' || trimmed === 'address' || trimmed === 'addys' || trimmed === 'wallets') {
      router.push('/addresses');
      return;
    }

    // Try natural language parsing
    const nlQuery = parseNaturalQuery(q);
    if (nlQuery) {
      const params = new URLSearchParams();
      params.set('q', q);
      if (nlQuery.params.minValue) params.set('min', String(nlQuery.params.minValue));
      if (nlQuery.params.maxValue) params.set('max', String(nlQuery.params.maxValue));
      if (nlQuery.params.exactValue) params.set('exact', String(nlQuery.params.exactValue));
      router.push(`/search?${params.toString()}`);
      return;
    }

    const type = detectSearchType(q);

    if (!type) {
      setError('Enter a valid block number, transaction hash, or address');
      return;
    }

    switch (type) {
      case 'block':
        router.push(`/block/${q}`);
        break;
      case 'tx':
        router.push(`/tx/${q}`);
        break;
      case 'address':
        router.push(`/address/${q}`);
        break;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="w-full max-w-[584px]">
      <form onSubmit={onSubmit}>
        <div
          className={`flex items-center px-4 py-3 rounded-full border bg-[#303134] transition-all ${
            isFocused
              ? 'border-transparent shadow-[0_0_0_1px_#5f6368] bg-[#303134]'
              : 'border-[#5f6368] hover:bg-[#303134] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]'
          }`}
        >
          <svg className="w-5 h-5 text-[#9aa0a6] mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className="flex-1 bg-transparent text-white text-base outline-none placeholder-[#9aa0a6]"
          />
        </div>
        {error && (
          <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
        )}
      </form>

      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {SUGGESTED_SEARCHES.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => {
                setQuery(suggestion.query);
                handleSearch(suggestion.query);
              }}
              className="px-4 py-2 text-sm text-[#bdc1c6] bg-[#303134] rounded-full border border-[#5f6368] hover:border-[#8ab4f8] hover:text-[#8ab4f8] transition-colors"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
