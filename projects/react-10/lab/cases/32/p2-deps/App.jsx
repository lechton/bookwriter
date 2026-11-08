import { useState, useEffect } from 'react';

function Player({ isPlaying }) {
  useEffect(() => {
    console.log('With [isPlaying], the Effect sees', isPlaying);
  }, [isPlaying]);
  useEffect(() => {
    console.log('With [], the Effect sees', isPlaying);
  }, []);
  return <p>{isPlaying ? 'Playing' : 'Paused'}</p>;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [other, setOther] = useState(0);
  return (
    <main>
      <button onClick={() => setIsPlaying(!isPlaying)}>Toggle</button>
      <button onClick={() => setOther(other + 1)}>Other {other}</button>
      <button onClick={() => setIsPlaying(isPlaying)}>Same</button>
      <Player isPlaying={isPlaying} />
    </main>
  );
}
