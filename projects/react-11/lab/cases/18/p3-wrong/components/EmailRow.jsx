export default function EmailRow({ key, from, subject }) {
  const inputId = 'mail-' + key;
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>
        <b>{from}</b>: {subject}
      </label>
    </li>
  );
}
