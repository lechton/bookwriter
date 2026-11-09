import { useState, useEffect } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';
import { sendOrder, logVisit } from './api.js';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0); // Principle 1: calculated during rendering

  useEffect(() => {
    logVisit('cart'); // Principle 3: runs because the cart is on the screen
  }, []);

  function handleRemove(id) {
    setItems(items.filter(item => item.id !== id));
  }

  function handlePlaceOrder() {
    sendOrder(items); // Principle 2: runs once for each click on Place order
    setIsOrdered(true);
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
        <OrderPlaced />
      ) : (
        <button onClick={handlePlaceOrder}>Place order</button>
      )}
    </main>
  );
}
