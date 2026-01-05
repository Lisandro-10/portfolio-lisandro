import { NextRequest, NextResponse } from 'next/server';
import { orders, type OrderProduct, type OrderCustomer, type OrderAddress } from '@/lib/tiendanube';

interface CreateOrderBody {
  products: OrderProduct[];
  customer?: Partial<OrderCustomer>;
  address?: Partial<OrderAddress>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderBody = await request.json();

    if (!body.products || body.products.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Validar que cada producto tenga los campos requeridos
    for (const product of body.products) {
      if (!product.variant_id || !product.quantity || !product.price) {
        return NextResponse.json(
          { error: 'Cada producto debe tener variant_id, quantity y price' },
          { status: 400 }
        );
      }
    }

    // Crear orden usando el servicio centralizado
    const { data, error } = await orders.create(
      body.products,
      body.customer,
      body.address
    );

    if (error) {
      console.error('Tiendanube order error:', error);
      return NextResponse.json(
        { error: 'No se pudo crear la orden', details: error.message },
        { status: error.status || 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Respuesta inválida de Tiendanube' },
        { status: 500 }
      );
    }

    // Construir la URL de pago si no viene en la respuesta
    const paymentUrl = data.payment_url || data.checkout_url || null;

    return NextResponse.json({ 
      paymentUrl,
      orderId: data.id,
      orderNumber: data.number,
      total: data.total,
      status: data.status
    });

  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const status = searchParams.get('status') || undefined;

    const { data, error } = await orders.getAll({
      page,
      per_page: perPage,
      status,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}