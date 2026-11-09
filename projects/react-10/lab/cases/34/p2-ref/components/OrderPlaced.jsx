import { useEffect, useRef } from 'react';
import { sendOrder } from '../api.js';

export default function OrderPlaced({ items }) {
  const didSend = useRef(false);
  useEffect(() => {
    if (didSend.current) return;
    didSend.current = true;
    sendOrder(items);
  }, [items]);

  return <p>Thank you! Your order is placed.</p>;
}
