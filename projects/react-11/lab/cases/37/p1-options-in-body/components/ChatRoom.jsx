import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';
export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { serverUrl: serverUrl, roomId: roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </section>
  );
}
