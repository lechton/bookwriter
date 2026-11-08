import { useState } from 'react';

export default function NameBox({ firstName, onFirstNameChange }) {
  const [text, setText] = useState(firstName);
  return (
    <label>
      First name
      <input
        value={text}
        onChange={e => {
          setText(e.target.value);
          onFirstNameChange(e.target.value);
        }}
      />
    </label>
  );
}
