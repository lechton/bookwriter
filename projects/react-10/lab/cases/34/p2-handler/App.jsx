import { useState } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';
import { sendOrder } from './api.js';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  function handleRemove(id) {
    setItems(items.filter(item => item.id !== id));
  }

  function handlePlaceOrder() {
    sendOrder(items); // 1. Sends the order, once for this click
    setIsOrdered(true); // 2. Then shows the thank-you line
  }

  return (
    <main>
      <h1>Your cart</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} ${item.price} <button onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      {isOrdered ? (
        <OrderPlaced /> // No props: the thank-you line only shows text now
      ) : (
        <button onClick={handlePlaceOrder}>Place order</button> // The click runs handlePlaceOrder
      )}
    </main>
  );
}
