import { useState } from 'react';

function WithUpdater() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: true });
  function handleAddThree() {
    setItem(prevItem => ({ ...prevItem, quantity: prevItem.quantity + 1 }));
    setItem(prevItem => ({ ...prevItem, quantity: prevItem.quantity + 1 }));
    setItem(prevItem => ({ ...prevItem, quantity: prevItem.quantity + 1 }));
  }
  return <p>Updater: Quantity {item.quantity}, gift wrap {item.giftWrap ? 'Yes' : 'No'} <button className="upd" onClick={handleAddThree}>+3</button></p>;
}

function WithSpread() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: true });
  function handleAddThree() {
    setItem({ ...item, quantity: item.quantity + 1 });
    setItem({ ...item, quantity: item.quantity + 1 });
    setItem({ ...item, quantity: item.quantity + 1 });
  }
  return <p>Spread: Quantity {item.quantity}, gift wrap {item.giftWrap ? 'Yes' : 'No'} <button className="spr" onClick={handleAddThree}>+3</button></p>;
}

function WithLocal() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: true });
  function handleAddOne() {
    const nextItem = { ...item };
    nextItem.quantity = nextItem.quantity + 1;
    setItem(nextItem);
  }
  return <p>Local copy: Quantity {item.quantity}, gift wrap {item.giftWrap ? 'Yes' : 'No'} <button className="loc" onClick={handleAddOne}>+1</button></p>;
}

export default function App() {
  return (
    <>
      <WithUpdater />
      <WithSpread />
      <WithLocal />
    </>
  );
}
