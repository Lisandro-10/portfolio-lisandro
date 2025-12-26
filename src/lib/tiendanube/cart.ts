// Tiendanube Cart Service
import { api } from './client';

// ============================================
// Types
// ============================================

export interface CheckoutItem {
  variant_id: number;
  quantity: number;
}

export interface CartResponse {
  id: string;
  checkout_url: string;
}

// ============================================
// Cart Service
// ============================================

export const cart = {
  /**
   * Crear checkout y obtener URL de pago
   */
  createCheckout: (items: CheckoutItem[]) => {
    return api.post<CartResponse>('/carts', {
      line_items: items,
    });
  },
};