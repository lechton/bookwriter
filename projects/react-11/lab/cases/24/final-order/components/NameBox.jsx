export default function NameBox({ firstName, onFirstNameChange }) {
  console.log('NameBox renders', JSON.stringify(firstName));
  return (
    <label>
      First name
      <input
        value={firstName}
        onChange={e => onFirstNameChange(e.target.value)}
      />
    </label>
  );
}
