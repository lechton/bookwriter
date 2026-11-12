import { useState, useEffect } from 'react';

const initialPlayers = ['John', 'Mia', 'Sara', 'Leo', 'Anna'];

export default function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [count, setCount] = useState(initialPlayers.length);
  useEffect(() => {
    setCount(players.length);
  }, [players]);
  console.log('render: ' + players.length + ' rows, count ' + count);
  return (
    <section>
      <p id="count">{count} players</p>
      <ul>
        {players.map(p => <li key={p}>{p}</li>)}
      </ul>
      <button onClick={() => setPlayers(players.slice(1))}>Remove first</button>
    </section>
  );
}
