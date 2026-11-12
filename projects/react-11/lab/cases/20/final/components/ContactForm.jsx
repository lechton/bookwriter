import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('delivery');
  const [message, setMessage] = useState('');
  const [wantsReply, setWantsReply] = useState(false);
  const [email, setEmail] = useState('');

  function handleMessageChange(e) {
    if (e.target.value.length <= 200) {
      setMessage(e.target.value);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', name, topic, message, wantsReply, email);
    setName('');
    setTopic('delivery');
    setMessage('');
    setWantsReply(false);
    setEmail('');
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label>
          Topic
          <select value={topic} onChange={e => setTopic(e.target.value)}>
            <option value="delivery">Delivery</option>
            <option value="payment">Payment</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Message
          <textarea value={message} onChange={handleMessageChange} />
        </label>
        <p>{message.length} / 200</p>
        <label>
          <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(e.target.checked)} />
          Email me a reply
        </label>
        {wantsReply && (
          <label>
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>
        )}
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
