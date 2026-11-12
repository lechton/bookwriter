import { useState } from 'react';

export default function MessageForm({ onSend }) {
  const [message, setMessage] = useState('');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      onSend();
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
