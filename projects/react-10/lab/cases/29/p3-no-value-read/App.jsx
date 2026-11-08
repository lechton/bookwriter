import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import { CartContext, CartDispatchContext } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext dispatch={dispatch}> {/* **WRONG:** a provider reads only the prop named value */}
        <Header />
        <CartPage />
      </CartDispatchContext>
    </CartContext>
  );
}
