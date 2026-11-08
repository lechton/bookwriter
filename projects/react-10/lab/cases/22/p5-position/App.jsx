import { useState } from 'react';

function TwoVariables() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  function handleMove(e) {
    setX(e.clientX);
    setY(e.clientY);
  }
  return <div id="two" onPointerMove={handleMove} style={{ height: 150, background: '#eee' }}><p>two: {x}, {y}</p></div>;
}

function OneObject() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  function handleMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
  return (
    <div>
      <div id="one" onPointerMove={handleMove} style={{ height: 150, background: '#ddd' }}><p>one: {position.x}, {position.y}</p></div>
      <p>y is {String(position.y)}, has y: {String('y' in position)}</p>
      <button onClick={() => setPosition({ x: 100 })}>Only x</button>
      <button onClick={() => setPosition({ ...position, x: 100 })}>Spread then x</button>
    </div>
  );
}

export default function App() {
  return (
    <main>
      <TwoVariables />
      <OneObject />
    </main>
  );
}
