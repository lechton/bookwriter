import { createContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export const ShopContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <ShopContext value={{ cart, dispatch }}>
      {children}
    </ShopContext>
  );
}
