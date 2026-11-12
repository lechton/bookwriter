import { useEffect, useLayoutEffect, useState } from 'react';

function NameBox({ onNameChange }) {
  const [text, setText] = useState('');
  console.log('NameBox renders', JSON.stringify(text));
  useEffect(() => {
    onNameChange(text);
  }, [text]);
  useLayoutEffect(() => {
    console.log('commit after NameBox: box', JSON.stringify(document.querySelector('input').value), 'badge', JSON.stringify(document.querySelector('h2').textContent));
  });
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

function BadgePreview({ firstName }) {
  console.log('BadgePreview renders', JSON.stringify(firstName));
  return <h2>{firstName}</h2>;
}

export default function App() {
  const [name, setName] = useState('');
  console.log('App renders', JSON.stringify(name));
  return (
    <>
      <NameBox onNameChange={setName} />
      <BadgePreview firstName={name} />
    </>
  );
}
