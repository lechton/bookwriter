import { useState } from 'react';
import { deliverMessage } from '../api.js';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  async function sendMessage(formData) {
    const message = { id: nextId++, text: formData.get('message') };
    await deliverMessage(message.text);
    setMessages([...messages, message]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <form action={sendMessage}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
