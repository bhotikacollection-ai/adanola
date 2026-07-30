import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'adanola_cart';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, size, color, quantity = 1 } = action.payload;
      const id = product._id || product.id;
      const key = `${id}|${size || ''}|${color || ''}`;
      const existing = state.find((i) => i.key === key);
      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...state,
        {
          key,
          productId: id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          slug: product.slug,
          size: size || '',
          color: color || '',
          quantity,
          currency: product.currency || 'EUR',
        },
      ];
    }
    case 'REMOVE':
      return state.filter((i) => i.key !== action.payload);
    case 'SET_QTY':
      return state
        .map((i) =>
          i.key === action.payload.key
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        )
        .filter((i) => i.quantity > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], load);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const clearToast = useCallback(() => setToast(''), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const freeShippingThreshold = 125;
    const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 6.95;
    const total = subtotal + shipping;

    return {
      items,
      count,
      subtotal,
      shipping,
      total,
      freeShippingThreshold,
      toast,
      clearToast,
      addItem: (product, opts = {}) => {
        dispatch({ type: 'ADD', payload: { product, ...opts } });
        setToast(`Added — ${product.name}`);
      },
      removeItem: (key) => dispatch({ type: 'REMOVE', payload: key }),
      setQty: (key, quantity) => dispatch({ type: 'SET_QTY', payload: { key, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items, toast, clearToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
