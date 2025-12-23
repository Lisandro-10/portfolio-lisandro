import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import { notFound } from 'next/navigation';
import ProductGallery from '@/app/components/product/ProductGallery';
import AddToCartButton from '@/app/components/cart/AddToCartButton';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    '/products?per_page=100&published=true'
  );
  
  // Generar rutas para ambos idiomas
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
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?handle=${slug}`
  );
  const product = products[0];

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const description = product.description[locale as 'es' | 'en'] || product.description.es;

  return {
    title: `${name} | Tu Tienda`,
    description: description.slice(0, 160),
    openGraph: {
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Buscar por handle (slug)
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?handle=${slug}`,
    { tags: ['products', `product-${slug}`] }
  );

  const product = products[0];
  if (!product) notFound();

  const mainVariant = product.variants[0];
  const price = parseFloat(mainVariant.price);
  const comparePrice = mainVariant.compare_at_price 
    ? parseFloat(mainVariant.compare_at_price) 
    : null;

  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const description = product.description[locale as 'es' | 'en'] || product.description.es;

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Galería de imágenes */}
          <ProductGallery images={product.images} />

          {/* Info del producto */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-primary">
                ${price.toLocaleString('es-AR')}
              </span>
              {comparePrice && (
                <span className="text-lg text-gray-400 line-through">
                  ${comparePrice.toLocaleString('es-AR')}
                </span>
              )}
            </div>

            {product.free_shipping && (
              <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                Envío gratis
              </div>
            )}

            <div 
              className="text-sm sm:text-base text-gray-300 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <AddToCartButton 
              productId={product.id}
              variantId={mainVariant.id}
              name={name}
              price={price}
              image={product.images[0]?.src || ''}
              stock={mainVariant.stock}
            />
          </div>
        </div>
      </section>
    </main>
  );
}