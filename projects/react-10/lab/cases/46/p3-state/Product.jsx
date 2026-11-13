import { useState, useEffect } from 'react';
import { getProduct } from './api.js';

export default function Product() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProduct().then(setProduct);
  }, []);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </>
  );
}
