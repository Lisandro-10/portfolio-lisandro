'use client';

import { useState, useCallback, useMemo } from 'react';
import { TiendanubeProduct, ProductVariant, LocalizedField } from '@/lib/tiendanube/types';
import ProductGallery from './ProductGallery';
import VariantSelector from './VariantSelector';
import AddToCartButton from '../cart/AddToCartButton';
import { useTranslations } from 'next-intl';

interface Props {
  product: TiendanubeProduct;
  locale: string;
}

export default function ProductDetail({ product, locale }: Props) {
  const t = useTranslations('Ecommerce');
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );

  const handleVariantChange = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
  }, []);

  // Build variant options string for cart display (e.g., "Celeste/Blanco - M")
  const variantOptions = useMemo(() => {
    if (!selectedVariant.values || selectedVariant.values.length === 0) {
      return undefined;
    }
    return selectedVariant.values
      .map(v => v?.[locale as keyof LocalizedField] || v?.es)
      .filter(Boolean)
      .join(' - ');
  }, [selectedVariant, locale]);

  // Price display
  const displayPrice = selectedVariant.promotional_price 
    ? parseFloat(selectedVariant.promotional_price)
    : parseFloat(selectedVariant.price);
  
  const comparePrice = selectedVariant.compare_at_price 
    ? parseFloat(selectedVariant.compare_at_price) 
    : null;

  const hasDiscount = selectedVariant.promotional_price && comparePrice;
  const discountPercent = hasDiscount 
    ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100)
    : 0;

  // Localized content
  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const description = product.description[locale as 'es' | 'en'] || product.description.es;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
      {/* Gallery */}
      <ProductGallery images={product.images} productName={name} />

      {/* Product info */}
      <div className="space-y-4 sm:space-y-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {name}
        </h1>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              ${displayPrice.toLocaleString('es-AR')}
            </span>
            {comparePrice && comparePrice !== displayPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${comparePrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>
          
          {hasDiscount && (
            <div className="inline-block bg-red-500/10 text-red-500 text-sm font-semibold px-3 py-1 rounded-full">
              ¡Ahorrás {discountPercent}%!
            </div>
          )}
        </div>

        {product.free_shipping && (
          <div className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
            {t('freeShipping')}
          </div>
        )}

        {/* Variant selector */}
        <VariantSelector 
          product={product}
          locale={locale}
          onVariantChange={handleVariantChange}
        />

        {/* Description */}
        <div 
          className="text-sm sm:text-base text-gray-300 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Add to cart */}
        <AddToCartButton 
          productId={product.id}
          variantId={selectedVariant.id}
          name={name}
          price={displayPrice}
          image={product.images[0]?.src || ''}
          stock={selectedVariant.stock}
          variantOptions={variantOptions}
        />

        {/* Additional info */}
        <div className="border-t border-dark-lighter pt-4 space-y-2 text-sm text-gray-400">
          {selectedVariant.sku && (
            <p>SKU: {selectedVariant.sku}</p>
          )}
          {product.brand && (
            <p>{t('brand')}: {product.brand}</p>
          )}
        </div>
      </div>
    </div>
  );
}