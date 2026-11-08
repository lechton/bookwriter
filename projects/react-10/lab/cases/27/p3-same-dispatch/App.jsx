import { useReducer, useState } from 'react';

const seen = [];

function reducer(count, action) {
  if (action.type === 'incremented') {
    return count + 1;
  }
}

export default function App() {
  const [count, dispatch] = useReducer(reducer, 0);
  const [, setOther] = useState(0);
  seen.push(dispatch);
  window.sameDispatch = () => ({ renders: seen.length, same: seen.every((d) => d === seen[0]) });
  return (
    <main>
      <button onClick={() => dispatch({ type: 'incremented' })}>Count: {count}</button>
      <button onClick={() => setOther((n) => n + 1)}>Other</button>
    </main>
  );
}
