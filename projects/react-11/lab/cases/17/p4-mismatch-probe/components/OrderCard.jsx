import { useState } from 'react';

const initialOrder = {
  item: 'Coffee mug',
  quantity: 1,
  giftWrap: false,
  customer: 'Anna Lee',
  delivery: { address: '12 Main Street', time: 'Morning' },
  note: '',
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
    setOrder({ ...order, delivery: { ...order.delivery, time: 'Evening' } });
  }

  function handleStartOver() {
    setOrder(initialOrder);
  }

  function handleChange(e) {
    setOrder({ ...order, [e.target.name]: e.target.value });
  }

  console.log('order keys:', JSON.stringify(order));

  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <p>For: {order.customer}</p>
      <p>Delivery: {order.delivery.address}, {order.delivery.time}</p>
      <p>Note: {order.note}</p>
      <label>
        Name
        <input name="customerName" value={order.customer} onChange={handleChange} />
      </label>
      <label>
        Note for the courier
        <input name="note" value={order.note} onChange={handleChange} />
      </label>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
