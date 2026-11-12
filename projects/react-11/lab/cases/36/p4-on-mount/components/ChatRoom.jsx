import { useEffect, useEffectEvent } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  const onMessage = useEffectEvent(msg => {
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  const onMount = useEffectEvent(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    connection.on('message', msg => onMessage(msg));
    return connection;
  });

  useEffect(() => {
    const connection = onMount();
    return () => connection.disconnect();
  }, []);

  return <h1>Welcome to the {roomId} room!</h1>;
}
