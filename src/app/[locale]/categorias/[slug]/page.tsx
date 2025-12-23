import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct, Category } from '@/lib/tiendanube/types';
import ProductGrid from '@/app/components/product/ProductGrid';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const categories = await tiendanubeApi<Category[]>('/categories');
  
  const paths: { locale: string; slug: string }[] = [];
  
  categories.forEach((category) => {
    if (category.handle.es) {
      paths.push({ locale: 'es', slug: category.handle.es });
    }
    if (category.handle.en) {
      paths.push({ locale: 'en', slug: category.handle.en });
    }
  });
  
  return paths;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  
  const categories = await tiendanubeApi<Category[]>('/categories');
  const category = categories.find(
    cat => cat.handle[locale as 'es' | 'en'] === slug || cat.handle.es === slug
  );

  if (!category) {
    return { title: 'Categoría no encontrada' };
  }

  const name = category.name[locale as 'es' | 'en'] || category.name.es;

  return {
    title: `${name} | Tu Tienda`,
    description: `Explora nuestros productos en ${name}`,
  };
}

export default async function CategoriaPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  const { page = '1' } = await searchParams;
  
  setRequestLocale(locale);

  // Obtener todas las categorías
  const categories = await tiendanubeApi<Category[]>('/categories');
  
  // Buscar la categoría actual por slug
  const category = categories.find(
    cat => cat.handle[locale as 'es' | 'en'] === slug || cat.handle.es === slug
  );

  if (!category) notFound();

  // Obtener productos de esta categoría
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?category_id=${category.id}&page=${page}&per_page=12&published=true`,
    { cache: 'force-cache', tags: ['products', `category-${category.id}`] }
  );

  const categoryName = category.name[locale as 'es' | 'en'] || category.name.es;

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6 text-gray-400">
          <Link 
            href="/productos" 
            className="hover:text-primary transition-colors"
          >
            Productos
          </Link>
          <ChevronRight size={16} />
          <span className="text-white">{categoryName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            {categoryName}
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Grid de productos */}
        {products.length > 0 ? (
          <ProductGrid products={products} locale={locale} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              No hay productos disponibles en esta categoría
            </p>
            <Link href="/productos" className="btn-primary inline-block">
              Ver todos los productos
            </Link>
          </div>
        )}

        {/* Paginación simple (opcional) */}
        {products.length === 12 && (
          <div className="flex justify-center mt-8 sm:mt-12 gap-4">
            {parseInt(page) > 1 && (
              <Link
                href={`/categorias/${slug}?page=${parseInt(page) - 1}`}
                className="btn-secondary"
              >
                Anterior
              </Link>
            )}
            {products.length === 12 && (
              <Link
                href={`/categorias/${slug}?page=${parseInt(page) + 1}`}
                className="btn-primary"
              >
                Siguiente
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}