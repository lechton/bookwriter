import { useEffect } from 'react';
import { sendOrder } from '../api.js';

export default function OrderPlaced({ items }) {
  useEffect(() => {
    sendOrder(items); // Sends the order when the thank-you line appears
  }, [items]);

  return <p>Thank you! Your order is placed.</p>;
}
