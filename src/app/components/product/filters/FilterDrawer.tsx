'use client';

import { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductFilters from './ProductFilters';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { useTranslations } from 'next-intl';
import type { AvailableFilters } from '@/lib/filters/product-filters';

interface FilterDrawerProps {
  availableFilters: AvailableFilters;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ 
  availableFilters, 
  isOpen, 
  onClose 
}: FilterDrawerProps) {
  const t = useTranslations('Ecommerce');
  const { activeFilterCount } = useProductFilters();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:hidden transform transition-transform duration-300 ease-out
                    ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('filters')}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-2 pb-1 bg-dark-lighter rounded-t-2xl">
          <div className="w-10 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-dark-lighter max-h-[80vh] overflow-y-auto p-4 pb-safe">
          <ProductFilters
            availableFilters={availableFilters}
            onClose={onClose}
          />

          {/* Apply button */}
          <div className="pt-4 mt-4 border-t border-dark">
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-dark font-semibold rounded-lg
                         hover:bg-primary/90 transition-colors"
            >
              {t('filter')}
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================
// Filter Trigger Button (for mobile toolbar)
// ============================================

interface FilterTriggerProps {
  onClick: () => void;
}

export function FilterTrigger({ onClick }: FilterTriggerProps) {
  const t = useTranslations('Ecommerce');
  const { activeFilterCount } = useProductFilters();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-dark-lighter border border-dark-lighter 
                 rounded-lg text-sm text-white hover:border-primary/50 transition-colors"
    >
      <SlidersHorizontal size={16} className="text-gray-400" />
      <span>{t('filters')}</span>
      {activeFilterCount > 0 && (
        <span className="flex items-center justify-center w-5 h-5 bg-primary text-dark 
                         text-xs font-bold rounded-full">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}