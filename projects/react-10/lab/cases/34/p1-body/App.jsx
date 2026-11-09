import { useState } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0); // 25 for Socks and Hat, 5 after Hat is removed

  function handleRemove(id) {
    setItems(items.filter(item => item.id !== id));
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
        <OrderPlaced items={items} />
      ) : (
        <button onClick={() => setIsOrdered(true)}>Place order</button>
      )}
    </main>
  );
}
