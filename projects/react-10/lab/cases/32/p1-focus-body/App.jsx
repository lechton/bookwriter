import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  inputRef.current.focus();
  return <input ref={inputRef} />;
}

export default function App() {
  return <MyComponent />;
}
