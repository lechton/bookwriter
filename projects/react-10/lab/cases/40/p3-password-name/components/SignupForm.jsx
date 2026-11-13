export default function SignupForm() {
  return (
    <form>
      <h2>Sign up</h2>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <p>Use 8 or more characters</p>
      <button type="submit">Sign up</button>
    </form>
  );
}
