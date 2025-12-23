// src/app/components/product/ProductGrid.tsx
'use client';

import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductCard from './ProductCard';

interface Props {
  products: TiendanubeProduct[];
  locale: string;
}

export default function ProductGrid({ products, locale }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}