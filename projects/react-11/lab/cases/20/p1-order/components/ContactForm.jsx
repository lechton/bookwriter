import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  function handleMessageChange(e) {
    console.log('handler runs, e.target.value:', JSON.stringify(e.target.value), 'box in the page:', JSON.stringify(document.querySelector('textarea').value));
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
