import { useState } from 'react';

const songs = () => [
  { id: 1, title: 'Sunny Road' },
  { id: 2, title: 'Blue Bicycle' },
  { id: 3, title: 'Night Train' },
];

const byTitle = (a, b) => a.title.localeCompare(b.title);

function SortInPlace() {
  const [queue, setQueue] = useState(songs);
  return (
    <section>
      <h2>sort on state</h2>
      <p>{queue.map(s => s.title).join(', ')}</p>
      <button onClick={() => setQueue(queue.sort(byTitle))}>Sort in place</button>{' '}
      <button onClick={() => setQueue(queue.reverse())}>Reverse in place</button>
    </section>
  );
}

function SortCopy() {
  const [queue, setQueue] = useState(songs);
  return (
    <section>
      <h2>sort on a copy</h2>
      <p>{queue.map(s => s.title).join(', ')}</p>
      <button onClick={() => setQueue([...queue].sort(byTitle))}>Sort a copy</button>{' '}
      <button onClick={() => setQueue(queue.toReversed())}>Reverse a copy</button>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <SortInPlace />
      <SortCopy />
    </main>
  );
}
