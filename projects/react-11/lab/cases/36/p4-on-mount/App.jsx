import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);

  return (
    <main>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom roomId={roomId} muted={muted} />
    </main>
  );
}
