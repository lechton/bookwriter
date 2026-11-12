import { useState } from 'react';

export default function App() {
  const [changes, setChanges] = useState(0);
  return (
    <main>
      <label>
        Name
        <input id="d" defaultValue="John" />
      </label>
      <label>
        Frozen
        <input id="r" value="John" readOnly onChange={() => setChanges(c => c + 1)} />
      </label>
      <p>Changes: {changes}</p>
      <div id="plain" />
    </main>
  );
}
