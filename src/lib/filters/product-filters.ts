import { TiendanubeProduct, LocalizedField } from '@/lib/tiendanube/types';

// ============================================
// Types
// ============================================

export interface AvailableFilters {
  attributes: Record<string, string[]>;  // { color: ['Rojo', 'Azul'], talle: ['S', 'M'] }
  priceRange: {
    min: number;
    max: number;
  };
}

// ============================================
// Extract Filters from Products
// ============================================

export function extractAvailableFilters(
  products: TiendanubeProduct[],
  locale: string
): AvailableFilters {
  const attributesMap: Record<string, Set<string>> = {};
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((product) => {
    // Get attribute names from product.attributes
    const attributeNames = product.attributes?.map(
      (attr) => attr[locale as keyof LocalizedField] || attr.es
    ) || [];

    // Extract values from variants
    product.variants.forEach((variant) => {
      // Price range
      const price = variant.promotional_price 
        ? parseFloat(variant.promotional_price)
        : parseFloat(variant.price);
      
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;

      // Attribute values
      if (variant.values && variant.values.length > 0) {
        variant.values.forEach((value, index) => {
          const attrName = attributeNames[index];
          if (!attrName) return;

          const attrValue = value?.[locale as keyof LocalizedField] || value?.es;
          if (!attrValue) return;

          if (!attributesMap[attrName]) {
            attributesMap[attrName] = new Set();
          }
          attributesMap[attrName].add(attrValue);
        });
      }
    });
  });

  // Convert Sets to sorted arrays
  const attributes: Record<string, string[]> = {};
  Object.entries(attributesMap).forEach(([key, valueSet]) => {
    attributes[key] = Array.from(valueSet).sort();
  });

  return {
    attributes,
    priceRange: {
      min: minPrice === Infinity ? 0 : Math.floor(minPrice),
      max: maxPrice === 0 ? 10000 : Math.ceil(maxPrice),
    },
  };
}

// ============================================
// Client-side Filtering (for when API doesn't support it)
// ============================================

export interface FilterParams {
  q?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  attributes?: Record<string, string[]>;
}

export function filterProducts(
  products: TiendanubeProduct[],
  params: FilterParams,
  locale: string
): TiendanubeProduct[] {
  return products.filter((product) => {
    // Search query
    if (params.q) {
      const query = params.q.toLowerCase();
      const name = (product.name[locale as 'es' | 'en'] || product.name.es).toLowerCase();
      const description = (product.description[locale as 'es' | 'en'] || product.description.es || '').toLowerCase();
      
      if (!name.includes(query) && !description.includes(query)) {
        return false;
      }
    }

    // Price range - check if any variant matches
    const matchesPriceRange = product.variants.some((variant) => {
      const price = variant.promotional_price 
        ? parseFloat(variant.promotional_price)
        : parseFloat(variant.price);
      
      if (params.minPrice !== null && params.minPrice !== undefined && price < params.minPrice) {
        return false;
      }
      if (params.maxPrice !== null && params.maxPrice !== undefined && price > params.maxPrice) {
        return false;
      }
      return true;
    });

    if (!matchesPriceRange) return false;

    // Attribute filters
    if (params.attributes && Object.keys(params.attributes).length > 0) {
      const attributeNames = product.attributes?.map(
        (attr) => attr[locale as keyof LocalizedField] || attr.es
      ) || [];

      // Product must have at least one variant matching ALL selected attribute filters
      const matchesAttributes = product.variants.some((variant) => {
        if (!variant.values || variant.values.length === 0) return false;

        return Object.entries(params.attributes!).every(([attrName, selectedValues]) => {
          if (selectedValues.length === 0) return true;

          const attrIndex = attributeNames.indexOf(attrName);
          if (attrIndex === -1) return false;

          const variantValue = variant.values[attrIndex];
          const value = variantValue?.[locale as keyof LocalizedField] || variantValue?.es;
          
          return selectedValues.includes(value || '');
        });
      });

      if (!matchesAttributes) return false;
    }

    return true;
  });
}

// ============================================
// Sorting
// ============================================

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

export function sortProducts(
  products: TiendanubeProduct[],
  sort: SortOption
): TiendanubeProduct[] {
  const sorted = [...products];

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => {
        const priceA = getLowestPrice(a);
        const priceB = getLowestPrice(b);
        return priceA - priceB;
      });

    case 'price_desc':
      return sorted.sort((a, b) => {
        const priceA = getLowestPrice(a);
        const priceB = getLowestPrice(b);
        return priceB - priceA;
      });

    case 'newest':
    default:
      return sorted.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }
}

function getLowestPrice(product: TiendanubeProduct): number {
  return product.variants.reduce((lowest, variant) => {
    const price = variant.promotional_price 
      ? parseFloat(variant.promotional_price)
      : parseFloat(variant.price);
    return price < lowest ? price : lowest;
  }, Infinity);
}