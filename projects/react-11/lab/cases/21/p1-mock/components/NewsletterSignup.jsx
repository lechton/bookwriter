export default function NewsletterSignup({ status = 'typing' }) {
  if (status === 'success') {
    return <p>Welcome to the list!</p>;
  }

  return (
    <form>
      <h2>Join our newsletter</h2>
      <input disabled={status === 'submitting'} />
      <button type="submit" disabled={status === 'submitting'}>Join</button>
      {status === 'submitting' && <p>Sending...</p>}
      {status === 'error' && <p style={{ color: 'red' }}>Please enter a full email address.</p>}
    </form>
  );
}
