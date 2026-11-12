import { useState } from 'react';

export default function App() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: false });
  function handleAddOne() {
    setItem(prevItem => { ...prevItem, quantity: prevItem.quantity + 1 });
  }
  return <button onClick={handleAddOne}>Quantity: {item.quantity}</button>;
}
