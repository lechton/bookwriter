export default function EmailRow({ from, subject }) {
  return (
    <li className="row">
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
