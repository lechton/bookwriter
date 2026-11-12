import { useContext } from 'react';
import { CartContext } from '../CartContext.jsx';

export default function Header() {
  const cart = useContext(CartContext); // The cart that App provides, with no prop
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
