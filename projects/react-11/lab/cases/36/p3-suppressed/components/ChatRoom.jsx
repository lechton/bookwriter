import { useEffect } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    connection.on('message', msg => {
      if (!muted) {
        showNotification('New message: ' + msg);
      }
    });
    return () => connection.disconnect();
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <h1>Welcome to the {roomId} room!</h1>;
}
