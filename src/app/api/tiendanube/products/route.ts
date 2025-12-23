// src/app/api/tiendanube/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { tiendanubeApi } from '@/lib/tiendanube/client';
import { TiendanubeProduct } from '@/lib/tiendanube/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '12';
  const categoryId = searchParams.get('category_id');

  let endpoint = `/products?page=${page}&per_page=${perPage}&published=true`;
  
  if (categoryId) {
    endpoint += `&category_id=${categoryId}`;
  }

  try {
    const products = await tiendanubeApi<TiendanubeProduct[]>(endpoint, {
      cache: 'force-cache',
      tags: ['products'],
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}