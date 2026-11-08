import { useContext } from 'react';
import { CartContext } from '../CartContext.jsx';
import CartRow from './CartRow.jsx';

export default function CartList() {
  console.log('CartList renders');
  const cart = useContext(CartContext);
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} item={item} /> // The one prop the row really needs
      ))}
    </ul>
  );
}
