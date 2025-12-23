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