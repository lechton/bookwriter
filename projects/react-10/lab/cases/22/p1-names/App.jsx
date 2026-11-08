import { useState } from 'react';

function WithState() {
  const [names, setNames] = useState(['John', 'Mia', 'Sara']);
  const [count, setCount] = useState(3);
  return (
    <div>
      <p>{count} names</p>
      <button onClick={() => setNames(names.slice(1))}>Remove first in state version</button>
      <p>{names.join(', ')}</p>
    </div>
  );
}

function WithLength() {
  const [names, setNames] = useState(['John', 'Mia', 'Sara']);
  const count = names.length;
  return (
    <div>
      <p>{count} names</p>
      <button onClick={() => setNames(names.slice(1))}>Remove first in length version</button>
      <p>{names.join(', ')}</p>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <WithState />
      <WithLength />
    </main>
  );
}
