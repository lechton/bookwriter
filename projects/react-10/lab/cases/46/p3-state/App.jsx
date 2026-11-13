import { useState } from 'react';
import Home from './Home.jsx';
import Product from './Product.jsx';

export default function App() {
  const [route, setRoute] = useState('home');

  return (
    <>
      {route === 'home' && <Home onOpen={() => setRoute('product')} />}
      {route === 'product' && <Product />}
    </>
  );
}
