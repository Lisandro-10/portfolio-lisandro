import { tiendanubeApiSafe } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import { notFound } from 'next/navigation';
import ProductDetail from '@/app/components/product/ProductDetail';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { AlertCircle } from 'lucide-react';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Safe static params - returns empty array if API fails
export async function generateStaticParams() {
  try {
    const products = await tiendanubeApiSafe<TiendanubeProduct[]>(
      '/products?per_page=100&published=true'
    );
    
    if (!products) {
      console.warn('generateStaticParams: Could not fetch products, returning empty params');
      return [];
    }
    
    const paths: { locale: string; slug: string }[] = [];
    
    products.forEach((product) => {
      if (product.handle.es) {
        paths.push({ locale: 'es', slug: product.handle.es });
      }
      if (product.handle.en) {
        paths.push({ locale: 'en', slug: product.handle.en });
      }
    });
    
    return paths;
  } catch (error) {
    console.error('generateStaticParams error:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  
  const products = await tiendanubeApiSafe<TiendanubeProduct[]>(
    `/products?handle=${slug}`
  );
  
  if (!products || products.length === 0) {
    return { title: 'Producto no encontrado' };
  }

  const product = products[0];
  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const description = product.description[locale as 'es' | 'en'] || product.description.es;

  return {
    title: `${name} | Tu Tienda`,
    description: description?.slice(0, 160) || '',
    openGraph: {
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const products = await tiendanubeApiSafe<TiendanubeProduct[]>(
    `/products?handle=${slug}`,
    { tags: ['products', `product-${slug}`] }
  );

  // API Error
  if (products === null) {
    return (
      <main className="pt-14 sm:pt-16">
        <section className="section-container">
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Error al cargar el producto
            </h1>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              No se pudo cargar el producto. Por favor, intenta de nuevo más tarde.
            </p>
            <Link href="/productos" className="btn-primary">
              Ver todos los productos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Product not found
  if (products.length === 0) {
    notFound();
  }

  const product = products[0];

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <ProductDetail product={product} locale={locale} />
      </section>
    </main>
  );
}