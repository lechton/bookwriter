import { useState } from 'react';

function save(formData) {
  console.log(formData.get('username'));
}

export default function App() {
  const [name, setName] = useState('');
  return (
    <form action={save}>
      <label>Username <input name="username" value={name} onChange={e => setName(e.target.value)} /></label>
      <button type="submit">Save</button>
    </form>
  );
}
