import { useCart } from '../CartContext.jsx';

export default function Header() {
  const cart = useCart();
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
