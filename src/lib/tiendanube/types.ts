export interface TiendanubeProduct {
  id: number;
  name: LocalizedField;
  description: LocalizedField;
  handle: LocalizedField;
  attributes: any[];
  published: boolean;
  free_shipping: boolean;
  requires_shipping: boolean;
  canonical_url: string;
  video_url: string | null;
  seo_title: LocalizedField;
  seo_description: LocalizedField;
  brand: string | null;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  tags: string;
  images: ProductImage[];
  categories: Category[];
}

export interface LocalizedField {
  es: string;
  en?: string;
  pt?: string;
}

export interface ProductVariant {
  id: number;
  image_id: number | null;
  product_id: number;
  position: number;
  price: string;
  compare_at_price: string | null;
  promotional_price: string | null;
  stock_management: boolean;
  stock: number | null;
  weight: string;
  width: string;
  height: string;
  depth: string;
  sku: string | null;
  values: any[]; // Vacío en la respuesta real
  barcode: string | null;
  mpn: string | null;
  age_group: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
  cost: string | null;
  visible: boolean;
  inventory_levels: InventoryLevel[];
}

export interface InventoryLevel {
  id: number;
  variant_id: number;
  location_id: string;
  stock: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  src: string;
  position: number;
  alt: any[]; // Array vacío en la respuesta real
  height: number;
  width: number;
  thumbnails_generated: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: LocalizedField;
  handle: LocalizedField;
  parent?: number | null;
}

// Tipos legacy - mantener por compatibilidad
export interface VariantValue {
  en: string;
  es: string;
}