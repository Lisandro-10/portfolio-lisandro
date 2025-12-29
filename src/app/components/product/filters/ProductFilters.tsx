'use client';

import SearchInput from './SearchInput';
import AttributeFilter from './AttributeFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import type { AvailableFilters } from '@/lib/filters/product-filters';

interface ProductFiltersProps {
  availableFilters: AvailableFilters;
  onClose?: () => void;  // For mobile drawer
  showHeader?: boolean;
}

export default function ProductFilters({ 
  availableFilters, 
  onClose,
  showHeader = true
}: ProductFiltersProps) {
  const t = useTranslations('Ecommerce');
  const { hasActiveFilters, clearFilters, activeFilterCount } = useProductFilters();

  return (
    <div className="flex flex-col h-full">
      {/* Header - primarily for mobile */}
      {showHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-dark-lighter mb-4">
          <h2 className="text-lg font-semibold text-white">
            {t('filters')}
            {activeFilterCount > 0 && (
              <span className="ml-2 text-sm text-primary">({activeFilterCount})</span>
            )}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors md:hidden"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <SearchInput />
      </div>

      {/* Dynamic Attribute Filters */}
      <div className="flex-1 overflow-y-auto space-y-0">
        {Object.entries(availableFilters.attributes).map(([name, options]) => (
          <AttributeFilter
            key={name}
            name={name}
            label={name}
            options={options}
          />
        ))}

        {/* Price Range */}
        <PriceRangeFilter
          minAvailable={availableFilters.priceRange.min}
          maxAvailable={availableFilters.priceRange.max}
        />
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="pt-4 mt-4 border-t border-dark-lighter">
          <button
            onClick={clearFilters}
            className="w-full py-2.5 text-sm text-primary border border-primary rounded-lg
                       hover:bg-primary hover:text-dark transition-colors"
          >
            {t('clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}