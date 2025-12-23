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