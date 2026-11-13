import { useState } from 'react';
import { deliverMessage } from '../api.js';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  async function sendMessage(formData) {
    const text = formData.get('message');
    await deliverMessage(text);
    setMessages(m => [...m, { id: nextId++, text }]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <li key={m.id}>{m.id}: {m.text}</li>)}
      </ul>
      <form action={sendMessage}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
