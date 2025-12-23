// src/app/components/cart/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Props {
  productId: number;
  variantId: number;
  name: string;
  price: number;
  image: string;
  stock: number | null;
}

export default function AddToCartButton({ 
  productId, 
  variantId, 
  name,
  price,
  image,
  stock 
}: Props) {
  const t = useTranslations('Ecommerce');
  const addItem = useCartStore((state: any) => state.addItem);
  const items = useCartStore((state: any) => state.items);
  const [isAdding, setIsAdding] = useState(false);
  
  const currentInCart = items.find((i: any) => i.variantId === variantId)?.quantity || 0;
  const isOutOfStock = stock !== null && stock <= 0;
  const reachedLimit = stock !== null && currentInCart >= stock;

  const handleAdd = () => {
    if (isOutOfStock || reachedLimit) return;
    
    setIsAdding(true);
    addItem({ productId, variantId, name, price, image });
    
    setTimeout(() => setIsAdding(false), 300);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock || reachedLimit || isAdding}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <ShoppingCart size={18} className={isAdding ? 'animate-bounce' : ''} />
      <span className="text-sm sm:text-base">
        {isOutOfStock 
          ? t('outOfStock')
          : reachedLimit 
          ? 'Máximo alcanzado'
          : t('addToCart')}
      </span>
    </button>
  );
}