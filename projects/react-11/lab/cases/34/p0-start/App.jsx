import { useState, useEffect } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0)); // Copies the total into state after the render
  }, [items]);

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
      <p>Total: ${total}</p> {/* Shows whatever total holds in state */}
      {isOrdered ? (
        <OrderPlaced items={items} /> // Appears after the click on Place order
      ) : (
        <button onClick={() => setIsOrdered(true)}>Place order</button>
      )}
    </main>
  );
}
