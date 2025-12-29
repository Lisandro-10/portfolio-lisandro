'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className = '' }: SearchInputProps) {
  const t = useTranslations('Ecommerce');
  const { filters, setSearch } = useProductFilters();
  const [localValue, setLocalValue] = useState(filters.q);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync local value when URL changes externally
  useEffect(() => {
    setLocalValue(filters.q);
  }, [filters.q]);

  // Debounced search
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      if (localValue !== filters.q) {
        setSearch(localValue);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localValue, filters.q, setSearch]);

  const handleClear = () => {
    setLocalValue('');
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={t('search')}
        className="w-full pl-10 pr-10 py-2.5 bg-dark-lighter border border-dark-lighter rounded-lg
                   text-sm text-white placeholder:text-gray-500
                   focus:outline-none focus:border-primary/50 transition-colors"
        aria-label={t('search')}
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors p-0.5"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}