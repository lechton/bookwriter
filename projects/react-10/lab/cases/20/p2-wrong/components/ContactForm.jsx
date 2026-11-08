import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', message);
    setMessage('');
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Message
          <textarea defaultValue="" onChange={handleMessageChange} />
        </label>
        <p>{message.length} / 200</p>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
