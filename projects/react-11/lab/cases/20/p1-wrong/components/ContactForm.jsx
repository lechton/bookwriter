export default function ContactForm() {
  let message = '';

  function handleMessageChange(e) {
    message = e.target.value;
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
