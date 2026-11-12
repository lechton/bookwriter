import { useState, useRef } from 'react';

window.__made = { inline: 0, lazy: 0 };

class VideoPlayer {
  constructor(kind) { window.__made[kind] += 1; }
}

function Inline() {
  const playerRef = useRef(new VideoPlayer('inline'));
  return <p>inline player kept: {String(playerRef.current instanceof VideoPlayer)}</p>;
}

function Lazy() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer('lazy');
  }
  return <p>lazy player kept: {String(playerRef.current instanceof VideoPlayer)}</p>;
}

export default function App() {
  const [n, setN] = useState(0);
  return (
    <main>
      <Inline key="a" n={n} />
      <Lazy key="b" n={n} />
      <button onClick={() => setN(n + 1)}>Render again {n}</button>
    </main>
  );
}
