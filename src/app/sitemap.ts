// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tu-dominio.com';
  
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    '/products?per_page=100&published=true'
  );

  const productUrls: MetadataRoute.Sitemap = [];
  
  products.forEach((product) => {
    // Español
    if (product.handle.es) {
      productUrls.push({
        url: `${baseUrl}/es/productos/${product.handle.es}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
    // Inglés
    if (product.handle.en) {
      productUrls.push({
        url: `${baseUrl}/en/productos/${product.handle.en}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  return [
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/es/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}