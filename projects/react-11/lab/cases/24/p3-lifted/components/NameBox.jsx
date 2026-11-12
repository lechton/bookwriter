export default function NameBox({ firstName, onFirstNameChange }) {
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
