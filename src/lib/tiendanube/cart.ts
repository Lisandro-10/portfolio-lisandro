import { api } from './client';

// ============================================
// Types
// ============================================

export interface CartProduct {
  variant_id: number;
  quantity: number;
  price: string;
  name?: string;
}

export interface CartCustomer {
  name: string;
  email: string;
  phone?: string;
  identification?: string;
}

export interface CartShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  number: string;
  floor?: string;
  locality: string;
  city: string;
  province: string;
  zipcode: string;
  country: string;
  phone?: string;
}

export interface DraftOrderResponse {
  id: number;
  token: string;
  store_id: number;
  abandoned_checkout_url: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  subtotal: string;
  discount: string;
  total: string;
  currency: string;
  payment_status: 'pending' | 'pending_confirmation' | 'paid';
  created_at: string;
  products: Array<{
    product_id: number;
    variant_id: number;
    name: string;
    price: string;
    quantity: number;
  }>;
}

export interface CreateCartOptions {
  revalidate?: number;
  tags?: string[];
}

// ============================================
// Cart Service
// ============================================

export const cart = {
  /**
   * Create a cart and get checkout URL for payment
   * 
   * This creates a Draft Order in Tiendanube which returns an `abandoned_checkout_url`.
   * Redirecting the customer to this URL takes them to Tiendanube's native checkout
   * where they can complete payment using MercadoPago or other configured methods.
   * 
   * @example
   * ```ts
   * const { data, error } = await cart.createCheckout(
   *   [{ variant_id: 123, quantity: 1, price: "1500.00" }],
   *   { name: "Juan", email: "juan@email.com" }
   * );
   * 
   * if (data?.abandoned_checkout_url) {
   *   // Redirect customer to complete payment
   *   window.location.href = data.abandoned_checkout_url;
   * }
   * ```
   */
  createCheckout: (
    products: CartProduct[],
    customer?: Partial<CartCustomer>,
    shippingAddress?: Partial<CartShippingAddress>
  ) => {
    const payload = {
      // Customer contact info
      contact_name: customer?.name || 'Cliente',
      contact_email: customer?.email || '',
      contact_phone: customer?.phone || '',
      contact_identification: customer?.identification || '',

      // Shipping address (optional, can be filled in checkout)
      ...(shippingAddress && {
        shipping_name: shippingAddress.first_name,
        shipping_address: shippingAddress.address,
        shipping_number: shippingAddress.number,
        shipping_floor: shippingAddress.floor || '',
        shipping_locality: shippingAddress.locality,
        shipping_city: shippingAddress.city,
        shipping_province: shippingAddress.province,
        shipping_zipcode: shippingAddress.zipcode,
        shipping_country: shippingAddress.country || 'AR',
        shipping_phone: shippingAddress.phone || customer?.phone || '',
      }),

      // Products
      products: products.map(p => ({
        variant_id: p.variant_id,
        quantity: p.quantity,
        price: p.price,
        ...(p.name && { name: p.name }),
      })),

      // Note: We don't set gateway - Tiendanube checkout handles payment method selection
    };

    return api.post<DraftOrderResponse>('/draft_orders', payload, {
      cache: 'no-store',
    });
  },

  /**
   * Get an existing draft order by ID
   */
  getById: (id: number, options?: CreateCartOptions) => {
    return api.get<DraftOrderResponse>(`/draft_orders/${id}`, {
      revalidate: options?.revalidate ?? 0,
      tags: options?.tags ?? ['cart', `cart-${id}`],
    });
  },
};