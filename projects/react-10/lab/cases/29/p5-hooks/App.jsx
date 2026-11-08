import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    <CartProvider> {/* Principle 4: every component inside can read the cart */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
