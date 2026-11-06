import { useState } from 'react';

let nextId = 4;

const initialQueue = [
  { id: 1, title: 'Sunny Road', liked: false },
  { id: 2, title: 'Blue Bicycle', liked: false },
  { id: 3, title: 'Night Train', liked: false },
];

export default function PlayQueue() {
  const [queue, setQueue] = useState(initialQueue);
  const [previous, setPrevious] = useState(null);
  const [volume, setVolume] = useState(5);

  function handleAddToQueue() {
    console.log('handler runs');
    setPrevious(queue);
    setQueue(q => {
      console.log('updater runs');
      q.push({ id: nextId++, title: 'Rainy Window', liked: false });
      return [...q];
    });
  }

  return (
    <section>
      <h1>Up Next</h1>
      <p>
        Suggested: Rainy Window{' '}
        <button onClick={handleAddToQueue}>Add to queue</button>{' '}
        <button onClick={() => setVolume(volume + 1)}>Louder</button> Volume {volume}
      </p>
      <ol>
        {queue.map((song, index) => (
          <li key={song.id}>
            {song.title}
            {index === 0 && ' · Now playing'}
          </li>
        ))}
      </ol>
    </section>
  );
}
