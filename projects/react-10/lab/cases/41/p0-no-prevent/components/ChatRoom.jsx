import { useState } from 'react';

const initialMessages = [{ id: 1, text: 'Hello there!' }];
let nextId = 2;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);

  function handleSubmit(e) {
    const formData = new FormData(e.target);
    setMessages([...messages, { id: nextId++, text: formData.get('message') }]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <form onSubmit={handleSubmit}>
        <input name="message" />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
