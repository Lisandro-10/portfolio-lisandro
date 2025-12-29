'use client';

import { useState, useMemo, Suspense } from 'react';
import ProductGrid from '@/app/components/product/ProductGrid';
import { 
  ProductFilters, 
  SortDropdown, 
  ActiveFilters, 
  FilterDrawer, 
  FilterTrigger 
} from '@/app/components/product/filters';
import { useProductFilters } from '@/app/hooks/useProductFilters';
import { 
  extractAvailableFilters, 
  filterProducts, 
  sortProducts 
} from '@/lib/filters/product-filters';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import { useTranslations } from 'next-intl';
import { Package } from 'lucide-react';

interface ProductsPageClientProps {
  products: TiendanubeProduct[];
  locale: string;
}

export default function ProductsPageClient({ products, locale }: ProductsPageClientProps) {
  const t = useTranslations('Ecommerce');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract available filter options from products
  const availableFilters = useMemo(
    () => extractAvailableFilters(products, locale),
    [products, locale]
  );

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <ProductsContent
        products={products}
        locale={locale}
        availableFilters={availableFilters}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
    </Suspense>
  );
}

// Separated to use hooks inside Suspense
function ProductsContent({
  products,
  locale,
  availableFilters,
  isDrawerOpen,
  setIsDrawerOpen,
}: {
  products: TiendanubeProduct[];
  locale: string;
  availableFilters: ReturnType<typeof extractAvailableFilters>;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}) {
  const t = useTranslations('Ecommerce');
  const { filters, hasActiveFilters } = useProductFilters();

  // Apply filters and sorting client-side
  const filteredProducts = useMemo(() => {
    let result = filterProducts(products, {
      q: filters.q,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      attributes: filters.attributes,
    }, locale);

    result = sortProducts(result, filters.sort);
    return result;
  }, [products, filters, locale]);

  return (
    <>
      {/* Mobile Filter Drawer */}
      <FilterDrawer
        availableFilters={availableFilters}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex gap-6 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <ProductFilters
              availableFilters={availableFilters}
              showHeader={false}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Mobile filter trigger */}
            <div className="md:hidden">
              <FilterTrigger onClick={() => setIsDrawerOpen(true)} />
            </div>

            {/* Results count (desktop) */}
            <p className="hidden md:block text-sm text-gray-400">
              {t('resultsCount', { count: filteredProducts.length })}
            </p>

            {/* Sort dropdown */}
            <SortDropdown />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-4">
              <ActiveFilters />
            </div>
          )}

          {/* Results count (mobile) */}
          <p className="md:hidden text-sm text-gray-400 mb-4">
            {t('resultsCount', { count: filteredProducts.length })}
          </p>

          {/* Product Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} locale={locale} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}

// ============================================
// Empty State
// ============================================

function EmptyState() {
  const t = useTranslations('Ecommerce');
  const { clearFilters } = useProductFilters();

  return (
    <div className="text-center py-12">
      <Package size={48} className="mx-auto mb-4 text-gray-500" />
      <h3 className="text-lg font-semibold mb-2">{t('noResults')}</h3>
      <p className="text-sm text-gray-400 mb-6">{t('noResultsHint')}</p>
      <button
        onClick={clearFilters}
        className="btn-primary"
      >
        {t('clearFilters')}
      </button>
    </div>
  );
}

// ============================================
// Loading Skeleton
// ============================================

function ProductsLoadingSkeleton() {
  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Sidebar skeleton */}
      <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
        <div className="space-y-4">
          <div className="h-10 bg-dark-lighter rounded-lg animate-pulse" />
          <div className="h-32 bg-dark-lighter rounded-lg animate-pulse" />
          <div className="h-32 bg-dark-lighter rounded-lg animate-pulse" />
        </div>
      </aside>

      {/* Grid skeleton */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <div className="h-10 w-24 bg-dark-lighter rounded-lg animate-pulse md:hidden" />
          <div className="h-10 w-40 bg-dark-lighter rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-lighter rounded-lg animate-pulse">
              <div className="h-48 sm:h-56" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-dark rounded w-3/4" />
                <div className="h-6 bg-dark rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}