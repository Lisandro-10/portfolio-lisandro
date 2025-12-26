import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/tiendanube';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '12');
  const categoryId = searchParams.get('category_id');

  const { data, error } = await products.getAll({
    page,
    perPage,
    categoryId: categoryId ? parseInt(categoryId) : undefined,
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status || 500 }
    );
  }

  return NextResponse.json(data);
}