import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function CartPage({ cart, onIncrease, onDecrease, onDelete, onEmpty }) { // Receives five props, reads none of them
  return (
    <main>
      <h2>Your cart</h2>
      <CartList cart={cart} onIncrease={onIncrease} onDecrease={onDecrease} onDelete={onDelete} />
      <EmptyCartButton onEmpty={onEmpty} />
    </main>
  );
}
