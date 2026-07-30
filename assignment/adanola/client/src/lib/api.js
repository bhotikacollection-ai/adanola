const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('adanola_token');
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const productsApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/products${q ? `?${q}` : ''}`);
  },
  one: (idOrSlug) => api(`/products/${idOrSlug}`),
  site: () => api('/products/site'),
};

export const siteConfigApi = {
  get: () => api('/site-config'),
  update: (body) => api('/site-config', { method: 'PUT', body: JSON.stringify(body) }),
};

export const authApi = {
  register: (body) => api('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/auth/me'),
};

export const wishlistApi = {
  list: () => api('/wishlist'),
  add: (productId) => api(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId) => api(`/wishlist/${productId}`, { method: 'DELETE' }),
};

export const ordersApi = {
  create: (body) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
  mine: () => api('/orders/mine'),
};

export function formatPrice(amount, currency = 'EUR') {
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `€${amount}`;
  }
}

export function productId(p) {
  return p?._id || p?.id;
}
