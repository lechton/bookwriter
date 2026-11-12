import { useState } from 'react';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSend(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Message
          <textarea defaultValue="" />
        </label>
        <button type="submit">Send</button>
      </form>
      {sent && <p>Thanks! Your message was sent.</p>}
    </>
  );
}
