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
  const [filteredPlayers, setFilteredPlayers] = useState(initialPlayers); // **WRONG:** stores the filtered rows in state

  function handleRemove(id) {
    setPlayers(players.filter(player => player.id !== id)); // Changes players and never touches filteredPlayers
  }

  return (
    <section>
      <h1>Team</h1>
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setFilteredPlayers(players.filter(player => player.name.includes(e.target.value))); // Filters only when the user types
        }}
        placeholder="Search players"
      />
      <p>Showing {filteredPlayers.length} of {players.length} players</p>
      <ul>
        {filteredPlayers.map(player => ( // Draws the rows from filteredPlayers in state
          <li key={player.id}>
            {player.name}
            <button onClick={() => handleRemove(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
