import { products, categories } from '@/lib/tiendanube';
import ProductGrid from '@/app/components/product/ProductGrid';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const { data } = await categories.getAll({ revalidate: 300 });
  
  if (!data) {
    console.warn('generateStaticParams: Could not fetch categories');
    return [];
  }
  
  const paths: { locale: string; slug: string }[] = [];
  
  data.forEach((category) => {
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
  
  const { data: category } = await categories.findBySlug(slug, locale);
  
  if (!category) {
    return { title: 'Categoría' };
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

  // Fetch category
  const { data: category, error: categoryError } = await categories.findBySlug(slug, locale);
  
  // API Error
  if (categoryError) {
    return (
      <main className="pt-14 sm:pt-16">
        <section className="section-container">
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Error al cargar la categoría
            </h1>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              No se pudo cargar la categoría. Por favor, intenta de nuevo más tarde.
            </p>
            <Link href="/productos" className="btn-primary">
              Ver todos los productos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!category) notFound();

  const categoryName = category.name[locale as 'es' | 'en'] || category.name.es;

  // Fetch products for this category
  const { data: productList, error: productsError } = await products.getAll(
    { page: parseInt(page), perPage: 12, categoryId: category.id },
    { tags: ['products', `category-${category.id}`] }
  );

  // Products fetch error
  if (productsError) {
    return (
      <main className="pt-14 sm:pt-16">
        <section className="section-container">
          <nav className="flex items-center gap-2 text-sm mb-6 text-gray-400">
            <Link href="/productos" className="hover:text-primary transition-colors">
              Productos
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">{categoryName}</span>
          </nav>

          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Error al cargar productos
            </h1>
            <p className="text-gray-400 mb-6">
              No se pudieron cargar los productos de esta categoría.
            </p>
            <Link href="/productos" className="btn-primary">
              Ver todos los productos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const productData = productList || [];

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
            {productData.length} {productData.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        {/* Grid de productos */}
        {productData.length > 0 ? (
          <ProductGrid products={productData} locale={locale} />
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

        {/* Paginación */}
        {productData.length === 12 && (
          <div className="flex justify-center mt-8 sm:mt-12 gap-4">
            {parseInt(page) > 1 && (
              <Link
                href={`/categorias/${slug}?page=${parseInt(page) - 1}`}
                className="btn-secondary"
              >
                Anterior
              </Link>
            )}
            <Link
              href={`/categorias/${slug}?page=${parseInt(page) + 1}`}
              className="btn-primary"
            >
              Siguiente
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}