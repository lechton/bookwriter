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
    setQueue([...queue, { id: nextId++, title: 'Rainy Window', liked: false }]); // Principle 1: Spread to add at end
  }

  function handleRemove(id) {
    setPrevious(queue);
    setQueue(queue.filter(s => s.id !== id)); // Principle 2: Filter to remove into a new array
  }

  function handlePlayNext() {
    const insertAt = 1;
    const newSong = { id: nextId++, title: 'Rainy Window', liked: false };
    setPrevious(queue);
    setQueue([...queue.slice(0, insertAt), newSong, ...queue.slice(insertAt)]); // Principle 3: Two slices to insert at index 1
  }

  function handleMoveUp(index) {
    const next = [...queue];
    const above = next[index - 1];
    next[index - 1] = next[index];
    next[index] = above;
    setPrevious(queue);
    setQueue(next); // Principle 4: Copy first, then swap on the copy
  }

  function handleLike(id) {
    setPrevious(queue);
    setQueue(queue.map(s => s.id === id ? { ...s, liked: !s.liked } : s)); // Principle 5: Map + object spread to update one item
  }

  function handleUndo() {
    setQueue(previous);
    setPrevious(null);
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
            <button onClick={() => handleLike(song.id)}>
              {song.liked ? 'Liked' : 'Like'}
            </button>{' '}
            {index > 1 && <button onClick={() => handleMoveUp(index)}>Move up</button>}{' '}
            <button onClick={() => handleRemove(song.id)}>Remove</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
