// Tiendanube Categories Service
import { api, TiendanubeError } from './client';
import { Category } from './types';

// ============================================
// Types
// ============================================

export interface CategoriesOptions {
  revalidate?: number;
  tags?: string[];
}

// ============================================
// Categories Service
// ============================================

export const categories = {
  /**
   * Lista todas las categorías
   */
  getAll: (options?: CategoriesOptions) => {
    return api.get<Category[]>('/categories', {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['categories'],
    });
  },

  /**
   * Categoría por ID
   */
  getById: (id: number, options?: CategoriesOptions) => {
    return api.get<Category>(`/categories/${id}`, {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['categories', `category-${id}`],
    });
  },

  /**
   * Buscar categoría por slug en un locale específico
   */
  findBySlug: async (slug: string, locale: string, options?: CategoriesOptions): Promise<{ data: Category | null; error: TiendanubeError | null }> => {
    const result = await api.get<Category[]>('/categories', {
      revalidate: options?.revalidate ?? 60,
      tags: options?.tags ?? ['categories'],
    });

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error,
      };
    }

    const category = result.data.find(
      cat => cat.handle[locale as 'es' | 'en'] === slug || cat.handle.es === slug
    );

    return {
      data: category || null,
      error: null,
    };
  },
};