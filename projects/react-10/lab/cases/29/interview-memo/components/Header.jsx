import { memo } from 'react';
import { useCart } from '../CartContext.jsx';

export default memo(function Header() {
  console.log('Header renders');
  const cart = useCart();
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
});
