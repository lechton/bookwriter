import { useState } from 'react';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Pause' : 'Play'}</button>
      <video id="v" width="250" muted loop playsInline src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" />
    </>
  );
}
