// Tiendanube API - Barrel Export

// Client & types
export { api, TiendanubeError, type ApiResult, type FetchOptions } from './client';
export * from './types';

// Services
export { products, type GetProductsParams, type ProductsOptions } from './products';
export { categories, type CategoriesOptions } from './categories';
export { 
  orders, 
  type OrderProduct, 
  type OrderCustomer, 
  type OrderAddress, 
  type CreateOrderPayload,
  type TiendanubeOrder,
  type CreateOrderOptions 
} from './orders';
export {
  cart,
  type CartProduct,
  type CartCustomer,
  type CartShippingAddress,
  type DraftOrderResponse,
  type CreateCartOptions,
} from './cart';