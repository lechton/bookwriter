import { useState } from 'react';

const initialOrder = {
  item: 'Coffee mug',
  quantity: 1,
  giftWrap: false,
  customer: 'Anna Lee',
  delivery: { address: '12 Main Street', time: 'Morning' },
};

export default function OrderCard() {
  const [order, setOrder] = useState(initialOrder);

  function handleAddOne() {
    setOrder({ ...order, quantity: order.quantity + 1 });
  }

  function handleGiftWrap() {
    setOrder({ ...order, giftWrap: true });
  }

  function handleEvening() {
    const next = { ...order };
    next.delivery.time = 'Evening';
    setOrder(next);
  }

  function handleStartOver() {
    setOrder(initialOrder);
  }

  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <p>For: {order.customer}</p>
      <p>Delivery: {order.delivery.address}, {order.delivery.time}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
