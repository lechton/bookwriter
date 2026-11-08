export default function NameBox({ firstName }) {
  return (
    <label>
      First name
      <input value={firstName} />
    </label>
  );
}
