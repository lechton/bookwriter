import { useState } from 'react';

export default function OrderCard() {
  const [order, setOrder] = useState({
    item: 'Coffee mug',
    quantity: 1,
    giftWrap: false,
    customer: 'Anna Lee',
  });

  function handleAddOne() {
    setOrder({ ...order, quantity: order.quantity + 1 });
  }

  function handleGiftWrap() {
    setOrder({ giftWrap: true, ...order });
  }

  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <p>For: {order.customer}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
