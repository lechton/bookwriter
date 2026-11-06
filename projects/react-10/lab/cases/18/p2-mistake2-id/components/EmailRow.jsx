export default function EmailRow({ id, from, subject }) {
  return (
    <li key={id} className="row">
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
