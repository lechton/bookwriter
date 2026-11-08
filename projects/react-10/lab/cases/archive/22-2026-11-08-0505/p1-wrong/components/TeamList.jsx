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
  const [count, setCount] = useState(initialPlayers.length); // **WRONG:** stores the number of players a second time in state

  function handleRemove(id) {
    setPlayers(players.filter(player => player.id !== id)); // Updates players to 4 items and never calls setCount
  }

  return (
    <section>
      <h1>Team</h1>
      <p>{count} players</p>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => handleRemove(player.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
