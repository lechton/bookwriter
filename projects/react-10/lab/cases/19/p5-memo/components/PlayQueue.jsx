import { memo, useState } from 'react';

const initialQueue = [
  { id: 1, title: 'Sunny Road', liked: false },
  { id: 2, title: 'Blue Bicycle', liked: false },
  { id: 3, title: 'Night Train', liked: false },
];

const SongRow = memo(function SongRow({ song }) {
  return <span className="row">{song.title} {song.liked ? 'Liked' : 'Like'}</span>;
});

export default function PlayQueue() {
  const [queue, setQueue] = useState(initialQueue);
  const [mode, setMode] = useState('wrong');

  function handleLikeWrong(index) {
    const next = [...queue];
    next[index].liked = !next[index].liked;
    setQueue(next);
  }

  function handleLikeRight(id) {
    setQueue(queue.map(s => s.id === id ? { ...s, liked: !s.liked } : s));
  }

  return (
    <section>
      <h1>Up Next</h1>
      <ol>
        {queue.map((song, index) => (
          <li key={song.id}>
            <SongRow song={song} /> | data {String(song.liked)}{' '}
            <button onClick={() => handleLikeWrong(index)}>Like wrong {song.id}</button>{' '}
            <button onClick={() => handleLikeRight(song.id)}>Like right {song.id}</button>
          </li>
        ))}
      </ol>
    </section>
  );
}
