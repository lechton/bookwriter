import { useState } from 'react';

export default function NoteBox({ friend }) {
  const [text, setText] = useState('');
  return (
    <section>
      <h2>Note to {friend}</h2>
      <textarea
        value={text}
        placeholder={'Write to ' + friend}
        onChange={e => setText(e.target.value)}
      />
      <button>Send to {friend}</button>
    </section>
  );
}
