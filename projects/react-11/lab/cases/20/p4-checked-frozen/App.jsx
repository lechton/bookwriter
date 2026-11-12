import { useState } from 'react';

export default function App() {
  const [agree, setAgree] = useState(false);

  return (
    <label>
      <input type="checkbox" checked={agree} />
      I agree
    </label>
  );
}
