// Tiendanube Products Service
import { api } from './client';
import { TiendanubeProduct } from './types';

// ============================================
// Types
// ============================================

export interface GetProductsParams {
  page?: number;
  perPage?: number;
  categoryId?: number;
  published?: boolean;
}

export interface ProductsOptions {
  revalidate?: number;
  tags?: string[];
}

// ============================================
// Products Service
// ============================================

export const products = {
  /**
   * Lista paginada de productos
   */
  getAll: (params?: GetProductsParams, options?: ProductsOptions) => {
    const { page = 1, perPage = 12, categoryId, published = true } = params || {};
    
    return api.get<TiendanubeProduct[]>('/products', {
      params: {
        page,
        per_page: perPage,
        published,
        ...(categoryId && { category_id: categoryId }),
      },
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['products'],
    });
  },

  /**
   * Producto por slug/handle
   */
  getBySlug: (slug: string, options?: ProductsOptions) => {
    return api.get<TiendanubeProduct[]>('/products', {
      params: { handle: slug },
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['products', `product-${slug}`],
    });
  },

  /**
   * Producto por ID
   */
  getById: (id: number, options?: ProductsOptions) => {
    return api.get<TiendanubeProduct>(`/products/${id}`, {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['products', `product-${id}`],
    });
  },

  /**
   * Todos los productos (para sitemap/SSG)
   */
  getAllForSitemap: (options?: ProductsOptions) => {
    return api.get<TiendanubeProduct[]>('/products', {
      params: {
        per_page: 100,
        published: true,
      },
      revalidate: options?.revalidate ?? 300,
      tags: options?.tags ?? ['products', 'sitemap'],
    });
  },
};