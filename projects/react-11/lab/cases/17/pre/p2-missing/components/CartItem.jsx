import { useState } from 'react';

export default function CartItem() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: false });

  function handleAddOne() {
    setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap });
  }

  function handleGiftWrap() {
    setItem({ giftWrap: true });
  }

  return (
    <section>
      <h1>Coffee mug</h1>
      <p>Quantity: {item.quantity}</p>
      <p>Gift wrap: {item.giftWrap ? 'Yes' : 'No'}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
