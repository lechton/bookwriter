import { useState, useReducer } from 'react';

function reducer(count, action) {
  if (action.type === 'incremented') {
    return count + 1;
  }
}

function StateCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

function ReducerCounter() {
  const [count, dispatch] = useReducer(reducer, 0);
  return <button onClick={() => dispatch({ type: 'incremented' })}>Count: {count}</button>;
}

export default function App() {
  return (
    <main>
      <p>useState</p>
      <StateCounter />
      <p>useReducer</p>
      <ReducerCounter />
    </main>
  );
}
