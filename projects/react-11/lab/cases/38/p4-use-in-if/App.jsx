import { createContext, use, useState } from 'react';

const ThemeContext = createContext('light');

function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    const theme = use(ThemeContext);
    return <h1>Thank you! Theme: {theme}</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}

export default function App() {
  return (
    <ThemeContext value="dark">
      <FeedbackForm />
    </ThemeContext>
  );
}
