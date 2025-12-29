'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

// ============================================
// Types
// ============================================

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export interface ProductFilters {
  q: string;
  sort: SortOption;
  minPrice: number | null;
  maxPrice: number | null;
  attributes: Record<string, string[]>; // { color: ['Rojo', 'Azul'], talle: ['M'] }
  page: number;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  // Setters
  setSearch: (query: string) => void;
  setSort: (sort: SortOption) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setAttribute: (name: string, values: string[]) => void;
  toggleAttributeValue: (name: string, value: string) => void;
  setPage: (page: number) => void;
  // Utils
  clearFilters: () => void;
  clearAttribute: (name: string) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

// ============================================
// Constants
// ============================================

const ATTRIBUTE_PREFIX = 'attr_';
const DEFAULT_SORT: SortOption = 'newest';

// ============================================
// Hook
// ============================================

export function useProductFilters(): UseProductFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters = useMemo((): ProductFilters => {
    const q = searchParams.get('q') || '';
    const sort = (searchParams.get('sort') as SortOption) || DEFAULT_SORT;
    const minPrice = searchParams.get('min_price') 
      ? Number(searchParams.get('min_price')) 
      : null;
    const maxPrice = searchParams.get('max_price') 
      ? Number(searchParams.get('max_price')) 
      : null;
    const page = Number(searchParams.get('page')) || 1;

    // Extract attribute filters (attr_color=Rojo,Azul)
    const attributes: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith(ATTRIBUTE_PREFIX)) {
        const attrName = key.replace(ATTRIBUTE_PREFIX, '');
        attributes[attrName] = value.split(',').filter(Boolean);
      }
    });

    return { q, sort, minPrice, maxPrice, attributes, page };
  }, [searchParams]);

  // Helper to update URL params
  const updateParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset page when filters change (except when setting page)
    if (!('page' in updates)) {
      params.delete('page');
    }

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Setters
  const setSearch = useCallback((query: string) => {
    updateParams({ q: query || null });
  }, [updateParams]);

  const setSort = useCallback((sort: SortOption) => {
    updateParams({ sort: sort === DEFAULT_SORT ? null : sort });
  }, [updateParams]);

  const setPriceRange = useCallback((min: number | null, max: number | null) => {
    updateParams({
      min_price: min !== null ? String(min) : null,
      max_price: max !== null ? String(max) : null,
    });
  }, [updateParams]);

  const setAttribute = useCallback((name: string, values: string[]) => {
    const key = `${ATTRIBUTE_PREFIX}${name}`;
    updateParams({ [key]: values.length > 0 ? values.join(',') : null });
  }, [updateParams]);

  const toggleAttributeValue = useCallback((name: string, value: string) => {
    const currentValues = filters.attributes[name] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setAttribute(name, newValues);
  }, [filters.attributes, setAttribute]);

  const setPage = useCallback((page: number) => {
    updateParams({ page: page > 1 ? String(page) : null });
  }, [updateParams]);

  const clearAttribute = useCallback((name: string) => {
    setAttribute(name, []);
  }, [setAttribute]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Computed
  const hasActiveFilters = useMemo(() => {
    return (
      filters.q !== '' ||
      filters.sort !== DEFAULT_SORT ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      Object.keys(filters.attributes).length > 0
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.minPrice !== null || filters.maxPrice !== null) count++;
    Object.values(filters.attributes).forEach(values => {
      count += values.length;
    });
    return count;
  }, [filters]);

  return {
    filters,
    setSearch,
    setSort,
    setPriceRange,
    setAttribute,
    toggleAttributeValue,
    setPage,
    clearFilters,
    clearAttribute,
    hasActiveFilters,
    activeFilterCount,
  };
}