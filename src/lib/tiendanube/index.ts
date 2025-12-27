// Tiendanube API - Barrel Export

// Client & types
export { api, TiendanubeError, type ApiResult, type FetchOptions } from './client';
export * from './types';

// Services
export { products, type GetProductsParams, type ProductsOptions } from './products';
export { categories, type CategoriesOptions } from './categories';
export { cart, type CheckoutItem, type CartResponse } from './cart';