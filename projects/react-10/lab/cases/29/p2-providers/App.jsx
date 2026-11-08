import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import { CartContext, CartDispatchContext } from './CartContext.jsx'; // Named exports, so curly braces
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  function handleIncrease(id) {
    dispatch({ type: 'increased', id: id });
  }

  function handleDecrease(id) {
    dispatch({ type: 'decreased', id: id });
  }

  function handleDelete(id) {
    dispatch({ type: 'deleted', id: id });
  }

  function handleEmpty() {
    dispatch({ type: 'emptied' });
  }

  return (
    <CartContext value={cart}> {/* Makes the cart available below */}
      <CartDispatchContext value={dispatch}> {/* Makes dispatch available below */}
        <Header cart={cart} />
        <CartPage cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onDelete={handleDelete} onEmpty={handleEmpty} />
      </CartDispatchContext>
    </CartContext>
  );
}
