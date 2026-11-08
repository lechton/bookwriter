import { useState } from 'react';

export default function App() {
  const [fruit, setFruit] = useState('orange');
  const [agree, setAgree] = useState(false);

  return (
    <form>
      <label>
        Fruit
        <select value={fruit} onChange={e => setFruit(e.target.value)}>
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
        I agree
      </label>
    </form>
  );
}
