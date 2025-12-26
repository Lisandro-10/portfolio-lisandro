import { NextRequest, NextResponse } from 'next/server';
import { cart, CheckoutItem } from '@/lib/tiendanube';

interface CheckoutBody {
  items: CheckoutItem[];
}

export async function POST(request: NextRequest) {
  const body: CheckoutBody = await request.json();

  const { data, error } = await cart.createCheckout(body.items);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }

  return NextResponse.json({ 
    checkoutUrl: data?.checkout_url 
  });
}