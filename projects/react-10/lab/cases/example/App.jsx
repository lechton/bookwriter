import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState(['Milk', 'Bread']);
  return (
    <main>
      <h1>Items: {items.length}</h1>
      <ul>
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
      <button onClick={() => setItems([...items, 'Eggs'])}>Add to cart</button>
    </main>
  );
}
