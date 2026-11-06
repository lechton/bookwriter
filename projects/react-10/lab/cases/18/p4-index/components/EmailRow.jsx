export default function EmailRow({ id, from, subject }) {
  const inputId = 'mail-' + id;
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>
        <b>{from}</b>: {subject}
      </label>
    </li>
  );
}
