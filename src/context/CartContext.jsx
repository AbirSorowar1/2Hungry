import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],
  isOpen: false,
  appliedPromo: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, quantity: action.qty } : i),
      };
    }
    case 'CLEAR':
      return { ...state, items: [], appliedPromo: null };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'APPLY_PROMO':
      return { ...state, appliedPromo: action.promo };
    case 'REMOVE_PROMO':
      return { ...state, appliedPromo: null };
    case 'LOAD':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('2hungry_cart');
    if (saved) {
      try { dispatch({ type: 'LOAD', items: JSON.parse(saved) }); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('2hungry_cart', JSON.stringify(state.items));
  }, [state.items]);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = state.items.length > 0 ? 39 : 0;
  const discount = state.appliedPromo
    ? state.appliedPromo.type === 'percent'
      ? Math.round(subtotal * state.appliedPromo.discount / 100)
      : state.appliedPromo.discount
    : 0;
  const total = subtotal + deliveryFee - discount;
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      appliedPromo: state.appliedPromo,
      subtotal,
      deliveryFee,
      discount,
      total,
      itemCount,
      dispatch,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
