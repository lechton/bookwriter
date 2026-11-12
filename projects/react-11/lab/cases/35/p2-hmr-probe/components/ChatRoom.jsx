import { useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  console.log('ChatRoom renders');
  useEffect(() => { console.log('effect with no array runs'); });
  return <h1>Welcome to the {roomId} room!</h1>;
}
