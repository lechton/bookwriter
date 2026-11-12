import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function CartPage() { // With no props at all
  console.log('CartPage renders');
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
