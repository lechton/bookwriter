import { useContext } from 'react';
import { ShopContext } from '../CartContext.jsx';

export default function Header() {
  const { cart } = useContext(ShopContext); // The cart that App provides, with no prop
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
