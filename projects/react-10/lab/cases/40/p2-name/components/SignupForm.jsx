export default function SignupForm() {
  console.log('SignupForm rendered');
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
        <input name="email" />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
