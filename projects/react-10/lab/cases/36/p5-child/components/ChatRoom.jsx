import { useEffect, useEffectEvent } from 'react';
import { createConnection } from '../chat.js';
import { showNotification } from '../notifications.js';
import MessageList from './MessageList.jsx';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId, muted }) {
  const onMessage = useEffectEvent(msg => {
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    connection.on('message', msg => onMessage(msg));
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <MessageList onMessage={onMessage} />
    </>
  );
}
