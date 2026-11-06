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

  function handleAddToQueue() {
    setPrevious(queue);
    setQueue([...queue, { id: nextId++, title: 'Rainy Window', liked: false }]);
  }

  function handleRemove(id) {
    setPrevious(queue);
    setQueue(queue.filter(s => s.id !== id));
  }

  function handleUndo() {
    setQueue(previous);
    setPrevious(null);
  }

  function handlePlayNext() {
    const insertAt = 1;
    const newSong = { id: nextId++, title: 'Rainy Window', liked: false };
    setPrevious(queue);
    setQueue([
      ...queue.slice(0, insertAt),
      newSong,
      ...queue.slice(insertAt),
    ]);
  }

  function handleMoveUp(index) {
    const above = queue[index - 1];
    queue[index - 1] = queue[index];
    queue[index] = above;
    setQueue(queue);
  }

  return (
    <section>
      <h1>Up Next</h1>
      <p>
        Suggested: Rainy Window{' '}
        <button onClick={handleAddToQueue}>Add to queue</button>{' '}
        <button onClick={handlePlayNext}>Play next</button>{' '}
        {previous && <button onClick={handleUndo}>Undo</button>}
      </p>
      <ol>
        {queue.map((song, index) => (
          <li key={song.id}>
            {song.title}
            {index === 0 && ' · Now playing'}{' '}
            {index > 1 && <button onClick={() => handleMoveUp(index)}>Move up</button>}{' '}
            <button onClick={() => handleRemove(song.id)}>Remove</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
