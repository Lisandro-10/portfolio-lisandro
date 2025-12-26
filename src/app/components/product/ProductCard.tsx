'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import { useTranslations } from 'next-intl';

interface Props {
  product: TiendanubeProduct;
  locale: string;
}

export default function ProductCard({ product, locale }: Props) {
  const t = useTranslations('Ecommerce');
  
  const mainVariant = product.variants[0];
  
  // Usar promotional_price si existe, sino usar price
  const displayPrice = mainVariant.promotional_price 
    ? parseFloat(mainVariant.promotional_price)
    : parseFloat(mainVariant.price);
  
  const comparePrice = mainVariant.compare_at_price 
    ? parseFloat(mainVariant.compare_at_price) 
    : null;

  // Nombre y handle según el idioma
  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const slug = product.handle[locale as 'es' | 'en'] || product.handle.es;

  // Badge de descuento si hay promotional_price
  const hasDiscount = mainVariant.promotional_price && comparePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
    : 0;

  return (
    <Link href={`/productos/${slug}`} className="project-card group">
      {/* Imagen */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-dark-lighter">
        {product.images[0] && (
          <Image
            src={product.images[0].src}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        )}
        
        {/* Badges - mobile-first positioning */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          {hasDiscount && (
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}
          {product.free_shipping && (
            <div className="bg-primary text-dark text-xs px-2 py-1 rounded-full">
              {t('freeShipping')}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg sm:text-xl font-bold text-primary">
            ${displayPrice.toLocaleString('es-AR')}
          </span>
          {comparePrice && comparePrice !== displayPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${comparePrice.toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {mainVariant.stock !== null && mainVariant.stock <= 0 && (
          <p className="text-xs text-gray-400">{t('outOfStock')}</p>
        )}
      </div>
    </Link>
  );
}