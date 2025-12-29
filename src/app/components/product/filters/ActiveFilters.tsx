'use client';

import { X } from 'lucide-react';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';

export default function ActiveFilters() {
  const t = useTranslations('Ecommerce');
  const { 
    filters, 
    setSearch, 
    setPriceRange, 
    toggleAttributeValue,
    clearFilters,
    hasActiveFilters 
  } = useProductFilters();

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search query */}
      {filters.q && (
        <FilterPill
          label={`"${filters.q}"`}
          onRemove={() => setSearch('')}
        />
      )}

      {/* Price range */}
      {(filters.minPrice !== null || filters.maxPrice !== null) && (
        <FilterPill
          label={formatPriceRange(filters.minPrice, filters.maxPrice)}
          onRemove={() => setPriceRange(null, null)}
        />
      )}

      {/* Attributes */}
      {Object.entries(filters.attributes).map(([attrName, values]) =>
        values.map((value) => (
          <FilterPill
            key={`${attrName}-${value}`}
            label={`${attrName}: ${value}`}
            onRemove={() => toggleAttributeValue(attrName, value)}
          />
        ))
      )}

      {/* Clear all */}
      <button
        onClick={clearFilters}
        className="text-xs text-primary hover:text-primary/80 transition-colors px-2 py-1"
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}

// ============================================
// FilterPill Component
// ============================================

interface FilterPillProps {
  label: string;
  onRemove: () => void;
}

function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-dark-lighter 
                     text-xs text-gray-300 rounded-full border border-dark">
      <span className="truncate max-w-[150px]">{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-dark rounded-full transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} />
      </button>
    </span>
  );
}

// ============================================
// Helpers
// ============================================

function formatPriceRange(min: number | null, max: number | null): string {
  if (min !== null && max !== null) {
    return `$${min.toLocaleString('es-AR')} - $${max.toLocaleString('es-AR')}`;
  }
  if (min !== null) {
    return `Desde $${min.toLocaleString('es-AR')}`;
  }
  if (max !== null) {
    return `Hasta $${max.toLocaleString('es-AR')}`;
  }
  return '';
}