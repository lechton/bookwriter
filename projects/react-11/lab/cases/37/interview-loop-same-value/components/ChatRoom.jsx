import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';
export default function ChatRoom({ roomId }) {
  const [isConnected, setIsConnected] = useState(false);

  const options = { serverUrl: serverUrl, roomId: roomId };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    setIsConnected(true);
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {roomId} room! {isConnected ? 'Connected' : ''}</h1>;
}
