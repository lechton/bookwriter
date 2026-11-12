import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form>
        <label>
          Message
          <textarea onChange={handleMessageChange} />
        </label>
        <p>{message.length} / 200</p>
      </form>
    </section>
  );
}
