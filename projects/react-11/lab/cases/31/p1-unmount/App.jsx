import { useState, useRef } from 'react';

export default function App() {
  const [show, setShow] = useState(true);
  const inputRef = useRef(null);
  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle box</button>
      <button onClick={() => console.log('ref holds', inputRef.current)}>Log ref</button>
      {show && <input ref={inputRef} />}
    </>
  );
}
