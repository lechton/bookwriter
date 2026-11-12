import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const options = { serverUrl: 'https://localhost:1234', roomId: 'music' };

export default function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <section>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </section>
  );
}
