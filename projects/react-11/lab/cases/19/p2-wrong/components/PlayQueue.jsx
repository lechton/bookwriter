import { useState } from 'react';

let nextId = 4;

const initialQueue = [
  { id: 1, title: 'Sunny Road', liked: false },
  { id: 2, title: 'Blue Bicycle', liked: false },
  { id: 3, title: 'Night Train', liked: false },
];

export default function PlayQueue() {
  const [queue, setQueue] = useState(initialQueue);

  function handleAddToQueue() {
    setQueue([...queue, { id: nextId++, title: 'Rainy Window', liked: false }]);
  }

  function handleRemove(id) {
    const i = queue.findIndex(s => s.id === id);
    queue.splice(i, 1);
    setQueue(queue);
  }

  return (
    <section>
      <h1>Up Next</h1>
      <p>
        Suggested: Rainy Window{' '}
        <button onClick={handleAddToQueue}>Add to queue</button>
      </p>
      <ol>
        {queue.map((song, index) => (
          <li key={song.id}>
            {song.title}
            {index === 0 && ' · Now playing'}{' '}
            <button onClick={() => handleRemove(song.id)}>Remove</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
