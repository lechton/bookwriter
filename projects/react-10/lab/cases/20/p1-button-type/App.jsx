import { useState } from 'react';

export default function App() {
  const [sent, setSent] = useState(false);
  function handleSend(e) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <form onSubmit={handleSend}>
      <button>Send without a type</button>
      {sent && <p>Thanks! Your message was sent.</p>}
    </form>
  );
}
