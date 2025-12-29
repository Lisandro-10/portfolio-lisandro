'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';

interface PriceRangeFilterProps {
  minAvailable?: number;
  maxAvailable?: number;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export default function PriceRangeFilter({ 
  minAvailable = 0,
  maxAvailable = 100000,
  collapsible = true,
  defaultOpen = true 
}: PriceRangeFilterProps) {
  const t = useTranslations('Ecommerce');
  const { filters, setPriceRange } = useProductFilters();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const [localMin, setLocalMin] = useState<string>(
    filters.minPrice !== null ? String(filters.minPrice) : ''
  );
  const [localMax, setLocalMax] = useState<string>(
    filters.maxPrice !== null ? String(filters.maxPrice) : ''
  );

  const debounceRef = useRef<NodeJS.Timeout>();

  // Sync with URL params
  useEffect(() => {
    setLocalMin(filters.minPrice !== null ? String(filters.minPrice) : '');
    setLocalMax(filters.maxPrice !== null ? String(filters.maxPrice) : '');
  }, [filters.minPrice, filters.maxPrice]);

  // Debounced update
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      const min = localMin !== '' ? Number(localMin) : null;
      const max = localMax !== '' ? Number(localMax) : null;
      
      if (min !== filters.minPrice || max !== filters.maxPrice) {
        setPriceRange(min, max);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localMin, localMax, filters.minPrice, filters.maxPrice, setPriceRange]);

  const hasValue = filters.minPrice !== null || filters.maxPrice !== null;

  return (
    <div className="border-b border-dark-lighter pb-4">
      {/* Header */}
      {collapsible ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="text-sm font-medium text-white">
            {t('priceRange')}
            {hasValue && (
              <span className="ml-2 text-xs text-primary">•</span>
            )}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <p className="text-sm font-medium text-white py-2">
          {t('priceRange')}
        </p>
      )}

      {/* Inputs */}
      {isOpen && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1">
            <label className="sr-only">{t('minPrice')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                placeholder={t('minPrice')}
                min={minAvailable}
                max={maxAvailable}
                className="w-full pl-7 pr-2 py-2 bg-dark border border-dark-lighter rounded-lg
                           text-sm text-white placeholder:text-gray-500
                           focus:outline-none focus:border-primary/50 transition-colors
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          
          <span className="text-gray-500 text-sm">-</span>
          
          <div className="flex-1">
            <label className="sr-only">{t('maxPrice')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                placeholder={t('maxPrice')}
                min={minAvailable}
                max={maxAvailable}
                className="w-full pl-7 pr-2 py-2 bg-dark border border-dark-lighter rounded-lg
                           text-sm text-white placeholder:text-gray-500
                           focus:outline-none focus:border-primary/50 transition-colors
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}