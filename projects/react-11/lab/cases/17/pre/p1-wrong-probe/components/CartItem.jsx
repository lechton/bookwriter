import { useState } from 'react';

export default function CartItem() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: false });
  console.log('CartItem renders, Quantity on screen:', item.quantity);
  function handleAddOne() {
    item.quantity = item.quantity + 1;
    setItem(item);
    console.log('handleAddOne: item.quantity is', item.quantity);
  }

  function handleGiftWrap() {
    setItem({ quantity: item.quantity, giftWrap: true });
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
