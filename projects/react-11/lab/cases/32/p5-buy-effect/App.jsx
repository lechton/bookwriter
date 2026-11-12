import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    fetch('/api/buy', { method: 'POST' });
  }, []);
  return <h1>Order page</h1>;
}
