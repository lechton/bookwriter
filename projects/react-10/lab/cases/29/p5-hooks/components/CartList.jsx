import { useCart } from '../CartContext.jsx';
import CartRow from './CartRow.jsx';

export default function CartList() {
  const cart = useCart();
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} item={item} /> // Principle 3: the one prop a row needs
      ))}
    </ul>
  );
}
