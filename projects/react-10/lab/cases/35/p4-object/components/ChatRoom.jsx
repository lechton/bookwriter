import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  const options = { serverUrl, roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <input aria-label="Message" value={message} onChange={e => setMessage(e.target.value)} />
    </section>
  );
}
