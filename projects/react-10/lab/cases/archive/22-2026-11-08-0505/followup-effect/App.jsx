import { useEffect, useState } from 'react';

const initialPlayers = [
  { id: 0, name: 'John' },
  { id: 1, name: 'Mia' },
  { id: 2, name: 'Sara' },
  { id: 3, name: 'Leo' },
  { id: 4, name: 'Anna' },
];

export default function App() {
  const [players, setPlayers] = useState(initialPlayers);
  const [count, setCount] = useState(initialPlayers.length);
  console.log(`render: players ${players.length}, count ${count}`);

  useEffect(() => {
    console.log(`effect: the page already says "${document.querySelector('p').textContent}"`);
    setCount(players.length);
  }, [players]);

  return (
    <section>
      <p>{count} players</p>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name}
            <button
              onClick={() => {
                requestAnimationFrame(() => console.log(`next frame callback, before the browser paints: "${document.querySelector('p').textContent}"`));
                setPlayers(players.filter(p => p.id !== player.id));
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
