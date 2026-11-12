import { useState } from 'react';
import CaptainLine from './CaptainLine.jsx';

const initialPlayers = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
  { id: 3, name: 'Leo' },
  { id: 4, name: 'Anna' },
];

export default function TeamList() { // 2. Called second, rendered by App
  const [players, setPlayers] = useState(initialPlayers); // Essential state 1: the players on the team
  const [query, setQuery] = useState(''); // Essential state 2: the search text
  const [captainId, setCaptainId] = useState(null); // Essential state 3, Principle 3: only the captain's id

  const visiblePlayers = players.filter(player => player.name.includes(query)); // Principle 2: derived from players and query
  const captain = players.find(player => player.id === captainId); // Principle 3: derived from players and captainId

  function handleRemove(id) {
    setPlayers(players.filter(player => player.id !== id));
  }

  return (
    <section>
      <h1>Team</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players" />
      <p>Showing {visiblePlayers.length} of {players.length} players</p> {/* Principle 1: counts read from .length */}
      <ul>
        {visiblePlayers.map(player => (
          <li key={player.id}>
            {player.name}
            {player.id === captainId && ' (captain)'}
            <button onClick={() => setCaptainId(player.id)}>Make captain</button>
            <button onClick={() => handleRemove(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
      {captain ? <CaptainLine name={captain.name} /> : <p>No captain yet</p>}
    </section>
  );
}
