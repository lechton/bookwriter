import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';
export default function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = { serverUrl: serverUrl, roomId: roomId };
    const connection = createConnection(options);
    connection.on('message', msg => {
      setMessages([...messages, msg]);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <h1>Welcome to the {roomId} room!</h1>
      <ul>
        {messages.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </section>
  );
}
