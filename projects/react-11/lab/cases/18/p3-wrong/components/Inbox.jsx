import EmailRow from './EmailRow.jsx';

const emails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

export default function Inbox() {
  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            key={email.id}
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
