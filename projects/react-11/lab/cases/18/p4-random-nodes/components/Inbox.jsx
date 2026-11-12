import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

let nextId = 104;

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleCheckMail() {
    const newEmail = {
      id: nextId++,
      from: 'Shop',
      subject: 'Your parcel has shipped'
    };
    setEmails([newEmail, ...emails]);
  }

  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <button onClick={handleCheckMail}>Check mail</button>
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            key={Math.random()}
            id={email.id}
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
