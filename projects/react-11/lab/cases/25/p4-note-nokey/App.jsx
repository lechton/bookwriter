import { useState } from 'react';
import NoteBox from './components/NoteBox.jsx';

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [friend, setFriend] = useState('Anna');
  const [showTip, setShowTip] = useState(false);

  return (
    <main>
      <h1>Write a Note</h1>
      <button onClick={() => setFriend('Anna')}>Anna</button>
      <button onClick={() => setFriend('Ben')}>Ben</button>
      <button onClick={() => setShowTip(!showTip)}>
        {showTip ? 'Hide tip' : 'Show tip'}
      </button>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close note' : 'Write a note'}
      </button>
      {showTip && <p>Tip: say one thing you like about them.</p>}
      {isOpen && <NoteBox friend={friend} />}
    </main>
  );
}
