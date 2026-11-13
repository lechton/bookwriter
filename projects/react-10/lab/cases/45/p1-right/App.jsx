function save(formData) {
  console.log(formData.get('username')); // Prints john
}

export default function App() {
  return (
    <form action={save}>
      <label>Username <input name="username" /></label>
      <button type="submit">Save</button>
    </form>
  );
}
