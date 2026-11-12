import { useState } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  return (
    <div
      onPointerMove={e => {
        setPosition({ x: e.clientX, y: e.clientY });
        window.__last = { clientX: e.clientX, clientY: e.clientY, pageX: e.pageX, pageY: e.pageY, scrollY: window.scrollY };
      }}
      style={{ height: 3000 }}
    >
      <p style={{ position: 'fixed', top: 0, left: 200 }}>x: {String(position.x)}, y: {String(position.y)}, has y: {String('y' in position)}</p>
      <button style={{ position: 'fixed', top: 40, left: 200 }} onClick={() => setPosition({ x: 100 })}>Only x</button>
      <button style={{ position: 'fixed', top: 80, left: 200 }} onClick={() => setPosition({ ...position, x: 100 })}>Spread x</button>
      <div style={{ position: 'absolute', backgroundColor: 'red', borderRadius: '50%', left: -10, top: -10, width: 20, height: 20, transform: `translate(${position.x}px, ${position.y}px)` }} />
    </div>
  );
}
