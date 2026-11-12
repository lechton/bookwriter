import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button onClick={onSquareClick}>{value}</button>;
}

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return <Square value={squares[0]} onSquareClick={handleClick(0)} />;
}
