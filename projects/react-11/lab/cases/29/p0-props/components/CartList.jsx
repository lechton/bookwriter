import CartRow from './CartRow.jsx';

export default function CartList({ cart, onIncrease, onDecrease, onDelete }) {
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} item={item} onIncrease={onIncrease} onDecrease={onDecrease} onDelete={onDelete} /> // Passes on three handlers it never calls
      ))}
    </ul>
  );
}
