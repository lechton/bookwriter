import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    console.log('Sending message from', name.trim());
    setSent(true);
    setName('');
    setMessage('');
  }

  return (
    <>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Your name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Message
          <textarea value={message} onChange={e => setMessage(e.target.value)} />
        </label>
        <p>{message.length} / 200</p>
        <button type="submit">Send</button>
      </form>
      {sent && <p>Thanks! Your message was sent.</p>}
    </>
  );
}
