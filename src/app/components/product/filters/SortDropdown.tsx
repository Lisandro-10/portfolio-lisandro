'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { useProductFilters, SortOption } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';

interface SortOptionItem {
  value: SortOption;
  labelKey: string;
}

const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'newest', labelKey: 'newest' },
  { value: 'price_asc', labelKey: 'priceAsc' },
  { value: 'price_desc', labelKey: 'priceDesc' },
];

export default function SortDropdown() {
  const t = useTranslations('Ecommerce');
  const { filters, setSort } = useProductFilters();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const currentOption = SORT_OPTIONS.find(opt => opt.value === filters.sort) || SORT_OPTIONS[0];

  const handleSelect = (value: SortOption) => {
    setSort(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Mobile optimized */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-lighter border border-dark-lighter 
                   rounded-lg text-sm text-white hover:border-primary/50 transition-colors
                   min-w-[140px] sm:min-w-[160px]"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <ArrowUpDown size={16} className="text-gray-400 flex-shrink-0" />
        <span className="flex-1 text-left truncate">
          {t(currentOption.labelKey)}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-full min-w-[160px] bg-dark-lighter border border-dark 
                     rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-3 text-left text-sm transition-colors
                         ${filters.sort === option.value 
                           ? 'bg-primary/10 text-primary' 
                           : 'text-gray-300 hover:bg-dark hover:text-white'
                         }`}
              role="option"
              aria-selected={filters.sort === option.value}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}