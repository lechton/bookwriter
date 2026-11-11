import { useEffectEvent } from 'react';
import { showNotification } from '../notifications.js';

export default function ChatRoom({ roomId, muted }) {
  const onMessage = useEffectEvent(msg => {
    if (!muted) {
      showNotification('New message: ' + msg);
    }
  });

  onMessage('test');

  return <h1>Welcome to the {roomId} room!</h1>;
}
