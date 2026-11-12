import { useState } from 'react';

export default function OrderCard() {
  const [order, setOrder] = useState({
    item: 'Coffee mug',
    quantity: 1,
    giftWrap: false,
  });

  function handleAddOne() {
    setOrder({ item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap });
  }

  function handleGiftWrap() {
    setOrder({ item: order.item, quantity: order.quantity, giftWrap: true });
  }

  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
