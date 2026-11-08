import { useState } from 'react';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export default function Cart() {
  const [cart, setCart] = useState(initialCart);

  function handleIncrease(id) {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  function handleDecrease(id) {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  }

  function handleDelete(id) {
    setCart(cart.filter(item => item.id !== id));
  }

  function handleEmpty() {
    setCart([]);
  }

  return (
    <section>
      <h1>Your cart</h1>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name}: {item.quantity}
            <button onClick={() => handleIncrease(item.id)}>Add one</button>
            <button onClick={() => handleDecrease(item.id)}>Remove one</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleEmpty}>Empty cart</button>
    </section>
  );
}
