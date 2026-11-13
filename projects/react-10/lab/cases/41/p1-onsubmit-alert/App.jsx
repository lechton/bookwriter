export default function App() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    alert(formData.get('message'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
