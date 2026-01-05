import { NextRequest, NextResponse } from 'next/server';

interface CheckoutProduct {
  variant_id: number;
  quantity: number;
}

interface CheckoutRequestBody {
  products: CheckoutProduct[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();

    // Validate products
    if (!body.products || body.products.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Get store URL from environment
    const storeUrl = process.env.TIENDANUBE_STORE_URL;
    
    if (!storeUrl) {
      console.error('Missing TIENDANUBE_STORE_URL environment variable');
      return NextResponse.json(
        { error: 'Configuración de tienda incompleta' },
        { status: 500 }
      );
    }

    // Build cart URL with all products
    // Format: /cart/add/{variant_id_1},{variant_id_2}?quantity[{variant_id}]=X
    const variantIds = body.products.map(p => p.variant_id).join(',');
    const quantities = body.products
      .map(p => `quantity[${p.variant_id}]=${p.quantity}`)
      .join('&');

    const checkoutUrl = `${storeUrl}/cart/add/${variantIds}?${quantities}`;

    return NextResponse.json({
      checkoutUrl,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}