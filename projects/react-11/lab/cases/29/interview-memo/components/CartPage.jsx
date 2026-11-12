import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function CartPage() { // Principle 3: no props to carry
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
