import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  console.log('App renders');
  return (
    <CartProvider> {/* Every component inside can read the cart and dispatch */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
