import { tiendanubeApiSafe } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductGrid from '@/app/components/product/ProductGrid';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; categoria?: string }>;
}

export default async function ProductosPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page = '1' } = await searchParams;
  
  setRequestLocale(locale);
  const t = await getTranslations('Ecommerce');

  const products = await tiendanubeApiSafe<TiendanubeProduct[]>(
    `/products?page=${page}&per_page=12&published=true`,
    { cache: 'force-cache', tags: ['products'] }
  );

  // Error state - API failed
  if (!products) {
    return (
      <main className="pt-14 sm:pt-16">
        <section className="section-container">
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Error al cargar productos
            </h1>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.
            </p>
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <main className="pt-14 sm:pt-16">
        <section className="section-container">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
            {t('products')}
          </h1>
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay productos disponibles</p>
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          {t('products')}
        </h1>
        <ProductGrid products={products} locale={locale} />
      </section>
    </main>
  );
}