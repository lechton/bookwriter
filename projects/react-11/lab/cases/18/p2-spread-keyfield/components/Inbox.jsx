import EmailRow from './EmailRow.jsx';

const emails = [
  { key: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { key: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { key: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

export default function Inbox() {
  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <ul className="list">
        {emails.map(email => (
          <EmailRow {...email} />
        ))}
      </ul>
    </section>
  );
}
