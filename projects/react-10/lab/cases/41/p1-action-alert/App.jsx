export default function App() {
  function sendMessage(formData) {
    alert(formData.get('message'));
  }

  return (
    <form action={sendMessage}>
      <input name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
