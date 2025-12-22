# Plan de Desarrollo: E-commerce con Next.js + Tiendanube (Actualizado)

## 🆕 Cambios Principales

1. **Multilenguaje**: Implementación con `next-intl` (ES/EN)
2. **Routing actualizado**: Estructura con `app/[locale]/`
3. **Dependencias actualizadas**: Next.js 14.2.35, next-intl 3.22.0
4. **TypeScript estricto**: Configuración mejorada

---

## Visión General

Frontend custom en Next.js con soporte multilenguaje que consume la API de Tiendanube.

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14 + i18n)                   │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │[locale]/    │  │  next-intl  │  │   Estado    │         │
│  │ Páginas     │  │Traducciones │  │  (Zustand)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                          │                                  │
│                    ┌─────▼─────┐                            │
│                    │API Routes │ ← Token seguro (.env)      │
│                    │ /api/*    │                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   api.tiendanube.com    │
              └─────────────────────────┘
```

---

## Stack Tecnológico Actualizado

| Componente | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.2.35 | Framework principal, API Routes |
| React | 18.x | UI Components |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | 3.4.1 | Estilos mobile-first |
| Zustand | 4.5.x | Estado global (carrito) |
| next-intl | 3.22.0 | Internacionalización |
| lucide-react | 0.561.0 | Iconos |

---

## Estructura del Proyecto Actualizada

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx             # Layout con i18n
│   │   ├── page.tsx                # Home multilenguaje
│   │   ├── productos/
│   │   │   ├── page.tsx            # Listado
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Detalle producto
│   │   ├── categorias/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── carrito/
│   │   │   └── page.tsx
│   │   └── checkout/
│   │       └── page.tsx
│   ├── api/                        # API Routes (proxy a Tiendanube)
│   │   └── tiendanube/
│   │       ├── products/
│   │       │   └── route.ts        # GET productos
│   │       ├── products/[id]/
│   │       │   └── route.ts        # GET producto individual
│   │       ├── categories/
│   │       │   └── route.ts
│   │       ├── cart/
│   │       │   └── route.ts        # POST crear carrito
│   │       └── checkout/
│   │           └── route.ts        # POST iniciar checkout
│   ├── components/
│   │   ├── ui/                     # Botones, inputs, etc.
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductGallery.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Ya existe con i18n
│   │   │   └── Footer.tsx          # Ya existe con i18n
│   │   └── LanguageSwitcher.tsx    # Cambio de idioma
│   ├── hooks/
│   │   └── useTheme.tsx            # Ya existe
│   ├── globals.css                 # Ya configurado
│   └── layout.tsx                  # Root layout
├── i18n/
│   ├── routing.ts                  # Configuración de rutas
│   └── navigation.ts               # Link, useRouter, usePathname
├── messages/
│   ├── es.json                     # Traducciones español
│   └── en.json                     # Traducciones inglés
├── lib/
│   ├── tiendanube/
│   │   ├── client.ts               # Cliente HTTP configurado
│   │   ├── products.ts             # Funciones de productos
│   │   ├── categories.ts
│   │   ├── cart.ts
│   │   └── types.ts                # Tipos de Tiendanube
│   └── utils.ts
├── stores/
│   └── cart-store.ts               # Zustand store
└── types/
    └── index.ts
```

---

## Fase 1: Configuración Base (Semana 1)

### 1.1 Variables de Entorno

```env
# .env.local
TIENDANUBE_STORE_ID=123456
TIENDANUBE_ACCESS_TOKEN=tu_token_aqui
TIENDANUBE_API_URL=https://api.tiendanube.com/v1
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### 1.2 Configuración de i18n (Ya implementado)

Tu proyecto ya tiene configurado next-intl. Solo necesitás agregar las traducciones del e-commerce:

```typescript
// messages/es.json (agregar sección de e-commerce)
{
  "Ecommerce": {
    "products": "Productos",
    "categories": "Categorías",
    "cart": "Carrito",
    "addToCart": "Agregar al carrito",
    "outOfStock": "Sin stock",
    "price": "Precio",
    "compareAt": "Antes",
    "freeShipping": "Envío gratis",
    "quantity": "Cantidad",
    "total": "Total",
    "checkout": "Finalizar compra",
    "emptyCart": "Tu carrito está vacío",
    "continueShopping": "Seguir comprando"
  }
}
```

### 1.3 Cliente HTTP para Tiendanube

```typescript
// src/lib/tiendanube/client.ts
const STORE_ID = process.env.TIENDANUBE_STORE_ID!;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN!;
const API_URL = process.env.TIENDANUBE_API_URL!;

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
}

export async function tiendanubeApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, cache = 'no-store', tags } = options;

  const response = await fetch(`${API_URL}/${STORE_ID}${endpoint}`, {
    method,
    headers: {
      'Authentication': `bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TuApp (contacto@tuapp.com)',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Tiendanube API error: ${response.status}`);
  }

  return response.json();
}
```

### 1.4 Tipos Base

```typescript
// src/lib/tiendanube/types.ts
export interface TiendanubeProduct {
  id: number;
  name: LocalizedField;
  description: LocalizedField;
  handle: LocalizedField;          // slug
  variants: ProductVariant[];
  images: ProductImage[];
  categories: Category[];
  published: boolean;
  free_shipping: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocalizedField {
  es: string;
  en?: string;
  pt?: string;
}

export interface ProductVariant {
  id: number;
  price: string;
  compare_at_price: string | null;
  stock: number | null;
  sku: string | null;
  values: VariantValue[];
}

export interface ProductImage {
  id: number;
  src: string;
  position: number;
  alt: string[];
}

export interface Category {
  id: number;
  name: LocalizedField;
  handle: LocalizedField;
  parent?: number | null;
}

export interface VariantValue {
  en: string;
  es: string;
}
```

---

## Fase 2: Catálogo de Productos (Semanas 2-3)

### 2.1 API Route - Listar Productos

```typescript
// src/app/api/tiendanube/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '12';
  const categoryId = searchParams.get('category_id');

  let endpoint = `/products?page=${page}&per_page=${perPage}&published=true`;
  
  if (categoryId) {
    endpoint += `&category_id=${categoryId}`;
  }

  try {
    const products = await tiendanubeApi<TiendanubeProduct[]>(endpoint, {
      cache: 'force-cache',
      tags: ['products'],
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
```

### 2.2 Página de Productos con i18n

```typescript
// src/app/[locale]/productos/page.tsx
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductGrid from '@/app/components/product/ProductGrid';
import { useTranslations } from 'next-intl';
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
```

### 2.3 Componente ProductGrid

```typescript
// src/app/components/product/ProductGrid.tsx
'use client';

import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductCard from './ProductCard';

interface Props {
  products: TiendanubeProduct[];
  locale: string;
}

export default function ProductGrid({ products, locale }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  );
}
```

### 2.4 Componente ProductCard (Mobile-First)

```typescript
// src/app/components/product/ProductCard.tsx
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
  const price = parseFloat(mainVariant.price);
  const comparePrice = mainVariant.compare_at_price 
    ? parseFloat(mainVariant.compare_at_price) 
    : null;

  // Nombre y handle según el idioma
  const name = product.name[locale as 'es' | 'en'] || product.name.es;
  const slug = product.handle[locale as 'es' | 'en'] || product.handle.es;

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
          />
        )}
        {product.free_shipping && (
          <div className="absolute top-2 right-2 bg-primary text-dark text-xs px-2 py-1 rounded-full">
            {t('freeShipping')}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg sm:text-xl font-bold text-primary">
            ${price.toLocaleString('es-AR')}
          </span>
          {comparePrice && (
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
```

### 2.5 Página de Detalle de Producto

```typescript
// src/app/[locale]/productos/[slug]/page.tsx
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
```

---

## Fase 3: Carrito de Compras (Semana 4)

### 3.1 Store con Zustand (Mobile-First)

```typescript
// src/stores/cart-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: number;
  variantId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.variantId === item.variantId);
          
          if (existing) {
            return {
              items: state.items.map(i =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter(i => i.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => 
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);
```

### 3.2 Componente AddToCartButton (Mobile-First)

```typescript
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
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const [isAdding, setIsAdding] = useState(false);
  
  const currentInCart = items.find(i => i.variantId === variantId)?.quantity || 0;
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
```

### 3.3 Componente CartItem (Mobile-First)

```typescript
// src/app/components/cart/CartItem.tsx
'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, CartItem as CartItemType } from '@/stores/cart-store';

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 sm:gap-4 bg-dark-lighter p-3 sm:p-4 rounded-lg">
      {/* Imagen */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-base sm:text-lg font-bold text-primary mb-2 sm:mb-3">
          ${item.price.toLocaleString('es-AR')}
        </p>

        {/* Controles mobile-first */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 bg-dark border border-dark-lighter rounded-lg">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="p-2 hover:bg-dark-lighter transition-colors rounded-l-lg"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="p-2 hover:bg-dark-lighter transition-colors rounded-r-lg"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.variantId)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Subtotal (solo visible en sm+) */}
      <div className="hidden sm:flex flex-col items-end justify-between">
        <p className="text-sm text-gray-400">Subtotal</p>
        <p className="text-lg font-bold">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}
```

---

## Fase 4: Checkout (Semana 5)

### 4.1 API Route para Checkout

```typescript
// src/app/api/tiendanube/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiendanubeApi } from '@/lib/tiendanube/client';

interface CheckoutBody {
  items: Array<{
    variant_id: number;
    quantity: number;
  }>;
}

export async function POST(request: NextRequest) {
  const body: CheckoutBody = await request.json();

  try {
    // Crear carrito en Tiendanube
    const cart = await tiendanubeApi<{ id: string; checkout_url: string }>(
      '/carts',
      {
        method: 'POST',
        body: {
          line_items: body.items,
        },
      }
    );

    return NextResponse.json({ 
      checkoutUrl: cart.checkout_url 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating checkout' },
      { status: 500 }
    );
  }
}
```

### 4.2 Página de Carrito (Mobile-First con i18n)

```typescript
// src/app/[locale]/carrito/page.tsx
'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import CartItem from '@/app/components/cart/CartItem';
import { useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function CarritoPage() {
  const t = useTranslations('Ecommerce');
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tiendanube/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variant_id: item.variantId,
            quantity: item.quantity,
          })),
        }),
      });

      const { checkoutUrl } = await response.json();
      
      // Redirigir al checkout de Tiendanube
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-14 sm:pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {t('emptyCart')}
          </h1>
          <button 
            onClick={() => router.push('/productos')}
            className="btn-primary"
          >
            {t('continueShopping')}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-14 sm:pt-16">
      <section className="section-container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          {t('cart')}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItem key={item.variantId} item={item} />
            ))}
          </div>

          {/* Resumen - Sticky en desktop */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-dark-lighter p-4 sm:p-6 rounded-lg border border-dark-lighter">
              <h2 className="text-lg sm:text-xl font-bold mb-4">
                Resumen del pedido
              </h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-dark">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-semibold">
                    ${totalPrice().toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Envío</span>
                  <span className="text-gray-400 text-xs">
                    Calculado en checkout
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${totalPrice().toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <span>{isLoading ? 'Procesando...' : t('checkout')}</span>
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <button
                onClick={() => router.push('/productos')}
                className="btn-secondary w-full mt-3"
              >
                {t('continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

---

## Fase 5: SEO y Performance (Semana 6)

### 5.1 Sitemap Multilenguaje

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tu-dominio.com';
  
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    '/products?per_page=100&published=true'
  );

  const productUrls: MetadataRoute.Sitemap = [];
  
  products.forEach((product) => {
    // Español
    if (product.handle.es) {
      productUrls.push({
        url: `${baseUrl}/es/productos/${product.handle.es}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
    // Inglés
    if (product.handle.en) {
      productUrls.push({
        url: `${baseUrl}/en/productos/${product.handle.en}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  return [
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/es/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/productos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
```

### 5.2 Revalidación de Datos con Webhook

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret');
  
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Invalidar cache según el evento de Tiendanube
  if (body.event.includes('product')) {
    revalidateTag('products');
    
    // Si es un producto específico, invalidar su tag también
    if (body.id) {
      revalidateTag(`product-${body.id}`);
    }
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

---

## Cronograma Actualizado

| Fase | Duración | Entregable |
|------|----------|------------|
| 1. Config Base + i18n | 1 semana | Cliente API, traducciones e-commerce |
| 2. Catálogo Multilenguaje | 2 semanas | Listado, detalle, categorías (ES/EN) |
| 3. Carrito | 1 semana | Carrito funcional con traducciones |
| 4. Checkout | 1 semana | Integración checkout Tiendanube |
| 5. SEO/Perf | 1 semana | Sitemap i18n, metadata, webhooks |
| **Total** | **6 semanas** | |

---

## Dependencias Actualizadas (package.json)

```json
{
  "name": "portfolio-lisandro-ecommerce",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@next/font": "^14.2.15",
    "lucide-react": "^0.561.0",
    "next": "14.2.35",
    "next-intl": "^3.22.0",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "^14.2.20",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## Configuración de Amplify (Actualizada)

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
```

---

## Variables de Entorno Requeridas

```bash
# Tiendanube
TIENDANUBE_STORE_ID=tu_store_id
TIENDANUBE_ACCESS_TOKEN=tu_token
TIENDANUBE_API_URL=https://api.tiendanube.com/v1

# Webhooks (opcional)
WEBHOOK_SECRET=clave_secreta_webhooks

# App
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

---

## Traducciones de E-commerce (Agregar a messages/*.json)

### messages/es.json

```json
{
  "Ecommerce": {
    "products": "Productos",
    "categories": "Categorías",
    "cart": "Carrito",
    "addToCart": "Agregar al carrito",
    "outOfStock": "Sin stock",
    "price": "Precio",
    "compareAt": "Antes",
    "freeShipping": "Envío gratis",
    "quantity": "Cantidad",
    "total": "Total",
    "subtotal": "Subtotal",
    "checkout": "Finalizar compra",
    "emptyCart": "Tu carrito está vacío",
    "continueShopping": "Seguir comprando",
    "viewProduct": "Ver producto",
    "backToProducts": "Volver a productos",
    "loadMore": "Cargar más",
    "filter": "Filtrar",
    "sortBy": "Ordenar por",
    "priceAsc": "Precio: menor a mayor",
    "priceDesc": "Precio: mayor a menor",
    "newest": "Más recientes",
    "featured": "Destacados"
  }
}
```

### messages/en.json

```json
{
  "Ecommerce": {
    "products": "Products",
    "categories": "Categories",
    "cart": "Cart",
    "addToCart": "Add to cart",
    "outOfStock": "Out of stock",
    "price": "Price",
    "compareAt": "Before",
    "freeShipping": "Free shipping",
    "quantity": "Quantity",
    "total": "Total",
    "subtotal": "Subtotal",
    "checkout": "Checkout",
    "emptyCart": "Your cart is empty",
    "continueShopping": "Continue shopping",
    "viewProduct": "View product",
    "backToProducts": "Back to products",
    "loadMore": "Load more",
    "filter": "Filter",
    "sortBy": "Sort by",
    "priceAsc": "Price: low to high",
    "priceDesc": "Price: high to low",
    "newest": "Newest",
    "featured": "Featured"
  }
}
```

---

## Notas Importantes

1. **Mobile-First**: Todos los componentes empiezan desde 320px
2. **i18n integrado**: Productos soportan ES/EN desde Tiendanube
3. **Token seguro**: Solo en API Routes y Server Components
4. **Cache optimizado**: ISR con revalidación por webhooks
5. **Checkout externo**: Redirige a Tiendanube para pagos
6. **Rutas multilenguaje**: Slugs diferentes por idioma (`/es/productos/remera` vs `/en/productos/shirt`)

---

## Próximos Pasos

1. Agregar las traducciones a `messages/es.json` y `messages/en.json`
2. Instalar Zustand: `npm install zustand`
3. Obtener credenciales de Tiendanube
4. Configurar variables de entorno
5. Implementar cliente API de Tiendanube
6. Crear componentes base del catálogo
