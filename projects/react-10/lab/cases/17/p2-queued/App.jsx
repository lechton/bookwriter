import { useState } from 'react';

export default function App() {
  const [order, setOrder] = useState({ item: 'Coffee mug', quantity: 1, giftWrap: false });
  const [order2, setOrder2] = useState({ item: 'Coffee mug', quantity: 1, giftWrap: false });

  function handleAddOneQueued() {
    setOrder(o => ({ ...o, quantity: o.quantity + 1 }));
  }

  function handleThreeQueued() {
    handleAddOneQueued();
    handleAddOneQueued();
    handleAddOneQueued();
  }

  function handleThreeSpread() {
    setOrder2({ ...order2, quantity: order2.quantity + 1 });
    setOrder2({ ...order2, quantity: order2.quantity + 1 });
    setOrder2({ ...order2, quantity: order2.quantity + 1 });
  }

  return (
    <main>
      <p>Updater: {order.quantity} {order.item}</p>
      <button className="queued" onClick={handleThreeQueued}>Three updaters</button>
      <p>Plain spread: {order2.quantity} {order2.item}</p>
      <button className="spread" onClick={handleThreeSpread}>Three plain spreads</button>
    </main>
  );
}
