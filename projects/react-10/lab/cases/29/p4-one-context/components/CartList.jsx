import { useContext } from 'react';
import { ShopContext } from '../CartContext.jsx';
import CartRow from './CartRow.jsx';

export default function CartList() {
  const { cart } = useContext(ShopContext);
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
