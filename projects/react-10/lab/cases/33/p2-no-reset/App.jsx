import { useState } from 'react';
import Bio from './components/Bio.jsx';

export default function App() {
  const [person, setPerson] = useState('Alice');

  return (
    <main>
      <button onClick={() => setPerson('Alice')}>Alice</button>
      <button onClick={() => setPerson('Bob')}>Bob</button>
      <button onClick={() => setPerson('Taylor')}>Taylor</button>
      <h2>{person}</h2>
      <Bio person={person} />
    </main>
  );
}
