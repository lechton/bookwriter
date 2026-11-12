import { useState } from 'react';
import MessageForm from './MessageForm.jsx';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return <MessageForm onSend={() => setIsSent(true)} />;
}
