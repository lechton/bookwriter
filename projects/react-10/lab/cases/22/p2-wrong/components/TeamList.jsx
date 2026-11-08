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
  const [filteredPlayers, setFilteredPlayers] = useState(initialPlayers);

  function handleRemove(id) {
    setPlayers(players.filter(player => player.id !== id));
  }

  function handleSearch(e) {
    setQuery(e.target.value);
    setFilteredPlayers(players.filter(player => player.name.includes(e.target.value)));
  }

  return (
    <section>
      <h1>Team</h1>
      <input value={query} onChange={handleSearch} placeholder="Search players" />
      <p>Showing {filteredPlayers.length} of {players.length} players</p>
      <ul>
        {filteredPlayers.map(player => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => handleRemove(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
