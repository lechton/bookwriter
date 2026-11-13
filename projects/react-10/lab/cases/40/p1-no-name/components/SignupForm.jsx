export default function SignupForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('email'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
