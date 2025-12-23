// src/lib/tiendanube/client.ts
const USER_ID = process.env.TIENDANUBE_USER_ID!;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN!;
const API_URL = process.env.TIENDANUBE_API_URL!;

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
}

export async function tiendanubeApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, cache = 'no-store', tags } = options;

  const response = await fetch(`${API_URL}/${USER_ID}${endpoint}`, {
    method,
    headers: {
      'Authentication': `bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'TuApp (contacto@tuapp.com)',
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next: tags ? { tags } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Tiendanube API error: ${response.status}`);
  }

  return response.json();
}