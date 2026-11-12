import { createContext, useContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

const CartContext = createContext(null); // Principle 1: one context for the cart
const CartDispatchContext = createContext(null); // Principle 1: one context for dispatch

export function CartProvider({ children }) { // Principle 4: holds the reducer and renders children
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}> {/* Principle 2: provides the cart */}
      <CartDispatchContext value={dispatch}>
        {children}
      </CartDispatchContext>
    </CartContext>
  );
}

export function useCart() { // Principle 5: reads the cart
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
