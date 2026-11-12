import NewsletterSignup from './components/NewsletterSignup.jsx';

export default function App() {
  return (
    <main>
      <h4>typing</h4>
      <NewsletterSignup status="typing" />
      <h4>error</h4>
      <NewsletterSignup status="error" />
      <h4>submitting</h4>
      <NewsletterSignup status="submitting" />
      <h4>success</h4>
      <NewsletterSignup status="success" />
    </main>
  );
}
