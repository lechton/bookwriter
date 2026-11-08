import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function App() {
  const [editing, setEditing] = useState(false);
  const [editing2, setEditing2] = useState(false);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  function handleEdit() {
    setEditing(true);
    inputRef.current.focus();
  }

  function handleEditFlush() {
    flushSync(() => setEditing2(true));
    inputRef2.current.focus();
  }

  return (
    <>
      <button onClick={handleEdit}>Edit</button>
      {editing && <input ref={inputRef} />}
      <button onClick={handleEditFlush}>Edit with flushSync</button>
      {editing2 && <input ref={inputRef2} />}
    </>
  );
}
