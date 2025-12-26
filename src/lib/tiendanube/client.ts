const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;
const API_URL = process.env.TIENDANUBE_API_URL;

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
}

export class TiendanubeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'TiendanubeError';
  }
}

export async function tiendanubeApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  // Validate environment variables
  if (!STORE_ID || !ACCESS_TOKEN || !API_URL) {
    console.error('Missing Tiendanube environment variables:', {
      hasStoreId: !!STORE_ID,
      hasAccessToken: !!ACCESS_TOKEN,
      hasApiUrl: !!API_URL,
    });
    throw new TiendanubeError(
      'Tiendanube configuration is incomplete',
      500,
      'CONFIG_ERROR'
    );
  }

  const { method = 'GET', body, cache = 'force-cache', tags, revalidate } = options;

  try {
    const response = await fetch(`${API_URL}/${STORE_ID}${endpoint}`, {
      method,
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'LASSENWARE (lisandroandia14@gmail.com)',
      },
      body: body ? JSON.stringify(body) : undefined,
      cache,
      next: {
        ...(tags && { tags }),
        ...(revalidate && { revalidate }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`Tiendanube API error: ${response.status}`, errorText);
      throw new TiendanubeError(
        `Tiendanube API error: ${response.status}`,
        response.status,
        'API_ERROR'
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof TiendanubeError) {
      throw error;
    }
    
    console.error('Tiendanube fetch error:', error);
    throw new TiendanubeError(
      'Failed to connect to Tiendanube API',
      500,
      'FETCH_ERROR'
    );
  }
}

// Safe version that returns null instead of throwing
export async function tiendanubeApiSafe<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  try {
    return await tiendanubeApi<T>(endpoint, options);
  } catch (error) {
    console.error('tiendanubeApiSafe caught error:', error);
    return null;
  }
}