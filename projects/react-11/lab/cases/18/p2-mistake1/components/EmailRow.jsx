export default function EmailRow({ from, subject }) {
  return (
    <li key={email.id} className="row">
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
