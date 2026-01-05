// Tiendanube Orders Service
import { api } from './client';

// ============================================
// Types
// ============================================

export interface OrderProduct {
  variant_id: number;
  quantity: number;
  price: string;
  name?: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

export interface OrderAddress {
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
  phone: string;
}

export interface CreateOrderPayload {
  currency: string;
  language: string;
  gateway: string;
  payment_status: 'pending' | 'authorized' | 'paid' | 'voided' | 'refunded';
  shipping: string;
  shipping_status: 'unpacked' | 'shipped' | 'unshipped';
  shipping_tracking_number?: string;
  shipping_tracking_url?: string;
  shipping_min_days?: number;
  shipping_max_days?: number;
  shipping_cost_owner: string;
  shipping_cost_customer: string;
  shipping_address: OrderAddress;
  billing_address?: OrderAddress;
  customer: OrderCustomer;
  products: OrderProduct[];
  note?: string;
  send_confirmation_email?: boolean;
  send_fulfillment_email?: boolean;
}

export interface TiendanubeOrder {
  id: number;
  number: string;
  token: string;
  store_id: number;
  status: string;
  payment_status: string;
  shipping_status: string;
  payment_url?: string;
  checkout_url?: string;
  cancel_reason?: string;
  currency: string;
  language: string;
  gateway: string;
  gateway_id?: string;
  total: string;
  subtotal: string;
  discount: string;
  shipping: string;
  shipping_cost_owner: string;
  shipping_cost_customer: string;
  coupon?: Array<{ code: string }>;
  products: OrderProduct[];
  customer: OrderCustomer;
  shipping_address: OrderAddress;
  billing_address?: OrderAddress;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderOptions {
  revalidate?: number;
  tags?: string[];
}

// ============================================
// Orders Service
// ============================================

export const orders = {
  /**
   * Crear una nueva orden
   * Requiere todos los campos obligatorios de la API de Tiendanube
   */
  create: (products: OrderProduct[], customerInfo?: Partial<OrderCustomer>, addressInfo?: Partial<OrderAddress>) => {
    // Construir el payload completo con valores por defecto
    const payload: CreateOrderPayload = {
      // Configuración de moneda e idioma
      currency: 'ARS',
      language: 'es',
      
      // Configuración de pago - pending para que genere payment_url
      gateway: 'not-provided',
      payment_status: 'pending',
      
      // Configuración de envío
      shipping: 'not-provided',
      shipping_status: 'unpacked',
      shipping_min_days: 3,
      shipping_max_days: 7,
      shipping_cost_owner: '0.00',
      shipping_cost_customer: '0.00',
      
      // Dirección de envío (con valores por defecto o los proporcionados)
      shipping_address: {
        first_name: addressInfo?.first_name || 'Cliente',
        last_name: addressInfo?.last_name || 'Web',
        address: addressInfo?.address || 'Dirección pendiente',
        number: addressInfo?.number || '100',
        floor: addressInfo?.floor || '',
        locality: addressInfo?.locality || 'Ciudad',
        city: addressInfo?.city || 'Ciudad',
        province: addressInfo?.province || 'Mendoza',
        zipcode: addressInfo?.zipcode || '5500',
        country: addressInfo?.country || 'AR',
        phone: addressInfo?.phone || customerInfo?.phone || '0000000000',
      },
      
      // Información del cliente
      customer: {
        name: customerInfo?.name || 'Cliente Web',
        email: customerInfo?.email || 'cliente@ejemplo.com',
        phone: customerInfo?.phone || '0000000000',
        document: customerInfo?.document || '',
      },
      
      // Productos del carrito
      products: products.map(p => ({
        variant_id: p.variant_id,
        quantity: p.quantity,
        price: p.price,
        name: p.name,
      })),
      
      // Opciones adicionales
      send_confirmation_email: true,
      send_fulfillment_email: false,
    };

    return api.post<TiendanubeOrder>('/orders', payload, {
      cache: 'no-store',
    });
  },

  /**
   * Obtener una orden por ID
   */
  getById: (id: number, options?: CreateOrderOptions) => {
    return api.get<TiendanubeOrder>(`/orders/${id}`, {
      revalidate: options?.revalidate ?? 0,
      tags: options?.tags ?? ['orders', `order-${id}`],
    });
  },

  /**
   * Listar órdenes
   */
  getAll: (params?: { page?: number; per_page?: number; status?: string }, options?: CreateOrderOptions) => {
    return api.get<TiendanubeOrder[]>('/orders', {
      params: {
        page: params?.page ?? 1,
        per_page: params?.per_page ?? 20,
        ...(params?.status && { status: params.status }),
      },
      revalidate: options?.revalidate ?? 0,
      tags: options?.tags ?? ['orders'],
    });
  },

  /**
   * Actualizar estado de pago
   */
  updatePaymentStatus: (orderId: number, status: 'pending' | 'authorized' | 'paid' | 'voided' | 'refunded') => {
    return api.put<TiendanubeOrder>(`/orders/${orderId}`, {
      payment_status: status,
    });
  },

  /**
   * Actualizar estado de envío
   */
  updateShippingStatus: (orderId: number, status: 'unpacked' | 'shipped' | 'unshipped', trackingNumber?: string, trackingUrl?: string) => {
    return api.put<TiendanubeOrder>(`/orders/${orderId}`, {
      shipping_status: status,
      ...(trackingNumber && { shipping_tracking_number: trackingNumber }),
      ...(trackingUrl && { shipping_tracking_url: trackingUrl }),
    });
  },
};