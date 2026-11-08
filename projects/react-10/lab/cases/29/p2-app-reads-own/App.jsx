import { useContext, useReducer } from 'react';
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
  console.log('App reads CartContext:', JSON.stringify(useContext(CartContext)), 'and CartDispatchContext:', JSON.stringify(useContext(CartDispatchContext)));
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        <Header /> {/* No props */}
        <CartPage /> {/* No props */}
      </CartDispatchContext>
    </CartContext>
  );
}
