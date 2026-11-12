import { useState } from 'react';

const initialItem = {
  quantity: 1,
  giftWrap: false,
  delivery: { address: '12 Main Street', time: 'Morning' },
  recipient: '',
  message: '',
};

export default function CartItem() {
  const [item, setItem] = useState(initialItem);

  function handleAddOne() {
    setItem({ ...item, quantity: item.quantity + 1 });
  }

  function handleGiftWrap() {
    setItem({ ...item, giftWrap: true });
  }

  function handleEvening() {
    setItem({ ...item, delivery: { ...item.delivery, time: 'Evening' } });
  }

  function handleStartOver() {
    setItem(initialItem);
  }

  function handleChange(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  return (
    <section>
      <h1>Coffee mug</h1>
      <p>Quantity: {item.quantity}</p>
      <p>Gift wrap: {item.giftWrap ? 'Yes' : 'No'}</p>
      <p>Delivery: {item.delivery.address}, {item.delivery.time}</p>
      <p>To: {item.recipient}</p>
      <p>Message: {item.message}</p>
      <label>To <input name="recipient" onChange={handleChange} /></label>
      <label>Message <input name="message" onChange={handleChange} /></label>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
