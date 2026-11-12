import { useState } from 'react';

const initialPlayers = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
  { id: 3, name: 'Leo' },
  { id: 4, name: 'Anna' },
];
export default function TeamList() {
  const [players, setPlayers] = useState(initialPlayers);
  const [query, setQuery] = useState('');
  const visiblePlayers = players.filter(player => player.name.includes(query));
  const [captain, setCaptain] = useState(null);

  function handleRemove(id) {
    setPlayers(players.filter(player => player.id !== id));
  }

  return (
    <section>
      <h1>Team</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players" />
      <p>Showing {visiblePlayers.length} of {players.length} players</p>
      <ul>
        {visiblePlayers.map(player => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => setCaptain(player)}>Make captain</button>
            <button onClick={() => handleRemove(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {captain ? <p>Captain: {captain.name}</p> : <p>No captain yet</p>}
    </section>
  );
}
