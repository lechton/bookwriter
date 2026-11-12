import { createContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export const CartContext = createContext(null);
export const CartDispatchContext = createContext(null);

export function CartProvider({ children }) { // The state of the cart now lives here
  console.log('CartProvider renders');
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        {children}
      </CartDispatchContext>
    </CartContext>
  );
}
