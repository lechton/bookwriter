import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    <>
      <Header /> {/* **WRONG:** outside CartProvider, so it reads null and the page goes blank */}
      <CartProvider><CartPage /></CartProvider>
    </>
  );
}
