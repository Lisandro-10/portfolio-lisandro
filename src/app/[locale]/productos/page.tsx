import { products } from '@/lib/tiendanube';
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

  const { data, error } = await products.getAll({
    page: parseInt(page),
    perPage: 12,
  });

  // Error state
  if (error) {
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
  if (!data || data.length === 0) {
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
        <ProductGrid products={data} locale={locale} />
      </section>
    </main>
  );
}