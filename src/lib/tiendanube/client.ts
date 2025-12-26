// Tiendanube API Client
// Capa abstracta para llamadas a la API de Tiendanube

const STORE_ID = process.env.TIENDANUBE_STORE_ID;
const ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN;
const API_URL = process.env.TIENDANUBE_API_URL;

// ============================================
// Types
// ============================================

export class TiendanubeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'TiendanubeError';
  }
}

export type ApiResult<T> = {
  data: T | null;
  error: TiendanubeError | null;
};

export interface FetchOptions {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  cache?: RequestCache;
  tags?: string[];
  revalidate?: number;
}

// ============================================
// Internal helpers
// ============================================

function validateConfig(): void {
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
}

function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  const query = queryParams.toString();
  return query ? `?${query}` : '';
}

async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  const text = await response.text();
  let result: T | null = null;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      return {
        data: null,
        error: new TiendanubeError('Invalid JSON response', response.status, 'PARSE_ERROR'),
      };
    }
  }

  if (!response.ok) {
    console.warn('Tiendanube API error:', response.status, result);
    return {
      data: null,
      error: new TiendanubeError(
        `Tiendanube API error: ${response.status}`,
        response.status,
        'API_ERROR',
        result
      ),
    };
  }

  return { data: result, error: null };
}

async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  try {
    validateConfig();
  } catch (error) {
    return {
      data: null,
      error: error as TiendanubeError,
    };
  }

  const { params, body, cache = 'force-cache', tags, revalidate } = options;
  const queryString = buildQueryString(params);
  const url = `${API_URL}/${STORE_ID}${endpoint}${queryString}`;

  try {
    const response = await fetch(url, {
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
        ...(revalidate !== undefined && { revalidate }),
      },
    });

    return parseResponse<T>(response);
  } catch (error) {
    console.error('Tiendanube fetch error:', error);
    return {
      data: null,
      error: new TiendanubeError(
        'Failed to connect to Tiendanube API',
        500,
        'FETCH_ERROR',
        error
      ),
    };
  }
}

// ============================================
// API Object - Public interface
// ============================================

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, 'GET', options),

  post: <T>(endpoint: string, body: unknown, options?: FetchOptions) => 
    request<T>(endpoint, 'POST', { ...options, body }),

  put: <T>(endpoint: string, body: unknown, options?: FetchOptions) => 
    request<T>(endpoint, 'PUT', { ...options, body }),

  del: <T>(endpoint: string, options?: FetchOptions) => 
    request<T>(endpoint, 'DELETE', options),
};

// ============================================
// Legacy wrappers (para compatibilidad)
// TODO: Migrar componentes y eliminar
// ============================================

/** @deprecated Use api.get/post/put/del instead */
export async function tiendanubeApi<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    cache?: RequestCache;
    tags?: string[];
    revalidate?: number;
  } = {}
): Promise<T> {
  const { method = 'GET', body, ...rest } = options;
  const result = await request<T>(endpoint, method, { ...rest, body });
  
  if (result.error) {
    throw result.error;
  }
  
  return result.data as T;
}

/** @deprecated Use api.get/post/put/del instead */
export async function tiendanubeApiSafe<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    cache?: RequestCache;
    tags?: string[];
    revalidate?: number;
  } = {}
): Promise<T | null> {
  const { method = 'GET', body, ...rest } = options;
  const result = await request<T>(endpoint, method, { ...rest, body });
  return result.data;
}