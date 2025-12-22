# Plan de Desarrollo: E-commerce con Next.js + Tiendanube

## Visión General

Frontend custom en Next.js que consume la API de Tiendanube. El cliente administra productos, stock y órdenes desde Tiendanube. Vos entregás la experiencia de usuario.

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js 14)                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Páginas   │  │  Componentes│  │   Estado    │         │
│  │  (SSR/SSG)  │  │    (React)  │  │  (Zustand)  │         │
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

## Stack Tecnológico

| Componente | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.2.x | Framework principal, API Routes |
| React | 18.3.x | UI Components |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | 3.4.x | Estilos |
| Zustand | 4.5.x | Estado global (carrito) |
| React Query | 5.x | Cache y fetching |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Home
│   ├── productos/
│   │   ├── page.tsx                # Listado
│   │   └── [slug]/
│   │       └── page.tsx            # Detalle producto
│   ├── categorias/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── carrito/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   └── api/                        # API Routes (proxy a Tiendanube)
│       └── tiendanube/
│           ├── products/
│           │   └── route.ts        # GET productos
│           ├── products/[id]/
│           │   └── route.ts        # GET producto individual
│           ├── categories/
│           │   └── route.ts
│           ├── cart/
│           │   └── route.ts        # POST crear carrito
│           └── checkout/
│               └── route.ts        # POST iniciar checkout
├── components/
│   ├── ui/                         # Botones, inputs, etc.
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   └── ProductGallery.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MobileNav.tsx
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

### 1.2 Cliente HTTP para Tiendanube

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

### 1.3 Tipos Base

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
}

export interface ProductVariant {
  id: number;
  price: string;
  compare_at_price: string | null;  // precio tachado
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

### 2.2 Página de Productos (Server Component)

```typescript
// src/app/productos/page.tsx
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import ProductGrid from '@/components/product/ProductGrid';

interface Props {
  searchParams: { page?: string; categoria?: string };
}

export default async function ProductosPage({ searchParams }: Props) {
  const page = searchParams.page || '1';
  
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?page=${page}&per_page=12&published=true`,
    { cache: 'force-cache', tags: ['products'] }
  );

  return (
    <main className="section-container">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Nuestros Productos
      </h1>
      <ProductGrid products={products} />
    </main>
  );
}
```

### 2.3 Página de Detalle de Producto

```typescript
// src/app/productos/[slug]/page.tsx
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';
import { notFound } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import AddToCartButton from '@/components/cart/AddToCartButton';

interface Props {
  params: { slug: string };
}

// Generar rutas estáticas para productos
export async function generateStaticParams() {
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    '/products?per_page=100&published=true'
  );
  
  return products.map((product) => ({
    slug: product.handle.es,
  }));
}

export default async function ProductoPage({ params }: Props) {
  // Buscar por handle (slug)
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?handle=${params.slug}`,
    { tags: ['products', `product-${params.slug}`] }
  );

  const product = products[0];
  if (!product) notFound();

  const mainVariant = product.variants[0];
  const price = parseFloat(mainVariant.price);
  const comparePrice = mainVariant.compare_at_price 
    ? parseFloat(mainVariant.compare_at_price) 
    : null;

  return (
    <main className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <ProductGallery images={product.images} />

        {/* Info del producto */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {product.name.es}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-primary">
              ${price.toLocaleString('es-AR')}
            </span>
            {comparePrice && (
              <span className="text-lg text-gray-400 line-through">
                ${comparePrice.toLocaleString('es-AR')}
              </span>
            )}
          </div>

          <div 
            className="text-gray-300 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: product.description.es }}
          />

          <AddToCartButton 
            productId={product.id}
            variantId={mainVariant.id}
            stock={mainVariant.stock}
          />
        </div>
      </div>
    </main>
  );
}
```

---

## Fase 3: Carrito de Compras (Semana 4)

### 3.1 Store con Zustand

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

### 3.2 Componente AddToCartButton

```typescript
// src/components/cart/AddToCartButton.tsx
'use client';

import { useCartStore } from '@/stores/cart-store';
import { ShoppingCart } from 'lucide-react';

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
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  
  const currentInCart = items.find(i => i.variantId === variantId)?.quantity || 0;
  const isOutOfStock = stock !== null && stock <= 0;
  const reachedLimit = stock !== null && currentInCart >= stock;

  const handleAdd = () => {
    if (isOutOfStock || reachedLimit) return;
    addItem({ productId, variantId, name, price, image });
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock || reachedLimit}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart size={20} />
      {isOutOfStock 
        ? 'Sin stock' 
        : reachedLimit 
        ? 'Máximo alcanzado'
        : 'Agregar al carrito'}
    </button>
  );
}
```

---

## Fase 4: Checkout (Semana 5)

### 4.1 Flujo de Checkout con Tiendanube

Tiendanube maneja el checkout completo. Tu trabajo es redirigir al usuario.

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

    // Devolver URL de checkout de Tiendanube
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

### 4.2 Página de Carrito con Botón de Checkout

```typescript
// src/app/carrito/page.tsx
'use client';

import { useCartStore } from '@/stores/cart-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CartItem from '@/components/cart/CartItem';

export default function CarritoPage() {
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
      <main className="section-container text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <a href="/productos" className="btn-primary">
          Ver productos
        </a>
      </main>
    );
  }

  return (
    <main className="section-container">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Tu Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </div>

        {/* Resumen */}
        <div className="bg-dark-lighter p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Resumen</h2>
          
          <div className="flex justify-between mb-4">
            <span className="text-gray-300">Subtotal</span>
            <span className="font-bold">
              ${totalPrice().toLocaleString('es-AR')}
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Envío calculado en el checkout
          </p>

          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Procesando...' : 'Finalizar compra'}
          </button>
        </div>
      </div>
    </main>
  );
}
```

---

## Fase 5: SEO y Performance (Semana 6)

### 5.1 Metadata Dinámica

```typescript
// src/app/productos/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const products = await tiendanubeApi<TiendanubeProduct[]>(
    `/products?handle=${params.slug}`
  );
  const product = products[0];

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name.es} | Tu Tienda`,
    description: product.description.es.slice(0, 160),
    openGraph: {
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}
```

### 5.2 Revalidación de Datos

```typescript
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Webhook de Tiendanube para invalidar cache
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret');
  
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Invalidar cache según el evento
  if (body.event.includes('product')) {
    revalidateTag('products');
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## Cronograma

| Fase | Duración | Entregable |
|------|----------|------------|
| 1. Config Base | 1 semana | Proyecto configurado, cliente API |
| 2. Catálogo | 2 semanas | Listado, detalle, categorías |
| 3. Carrito | 1 semana | Carrito funcional con Zustand |
| 4. Checkout | 1 semana | Integración checkout Tiendanube |
| 5. SEO/Perf | 1 semana | Metadata, sitemap, optimizaciones |
| **Total** | **6 semanas** | |

---

## Dependencias

```json
{
  "dependencies": {
    "next": "14.2.15",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zustand": "^4.5.5",
    "@tanstack/react-query": "^5.56.2",
    "lucide-react": "^0.441.0"
  },
  "devDependencies": {
    "typescript": "^5.6.2",
    "@types/node": "^22.5.5",
    "@types/react": "^18.3.5",
    "tailwindcss": "^3.4.11",
    "postcss": "^8.4.45",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.15"
  }
}
```

---

## Variables de Entorno Requeridas

```bash
# Tiendanube
TIENDANUBE_STORE_ID=tu_store_id
TIENDANUBE_ACCESS_TOKEN=tu_token

# Opcional: para webhooks
WEBHOOK_SECRET=clave_secreta_webhooks

# App
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

---

## Notas Importantes

1. **El token NUNCA va al cliente** - Solo se usa en API Routes y Server Components
2. **Cache agresivo** - Productos cambian poco, usá `force-cache` y revalidá con webhooks
3. **El checkout es de Tiendanube** - No reinventes la rueda, redirigí al usuario
4. **Mobile-first** - Todo el CSS empieza desde 320px