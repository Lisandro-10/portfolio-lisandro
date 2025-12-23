import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductGrid from '@/app/components/product/ProductGrid';
import { setRequestLocale } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; categoria?: string }>;
}

export default async function ProductosPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page = '1' } = await searchParams;
  
  setRequestLocale(locale);

  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?page=${page}&per_page=12&published=true`,
    { cache: 'force-cache', tags: ['products'] }
  );

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          {/* Traducción desde messages/{locale}.json */}
        </h1>
        <ProductGrid products={products} locale={locale} />
      </section>
    </main>
  );
}