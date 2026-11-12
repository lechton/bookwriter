export default function SubscribeBox({ status = 'typing' }) {
  if (status === 'success') {
    return <h2>You are subscribed!</h2>;
  }

  return (
    <section>
      <h2>Get our weekly news</h2>
      <label>
        Your email
        <input disabled={status === 'sending'} />
      </label>
      <button disabled={status === 'sending'}>Subscribe</button>
      {status === 'sending' && <p>Subscribing...</p>}
      {status === 'error' && <p>This email is already subscribed.</p>}
    </section>
  );
}
