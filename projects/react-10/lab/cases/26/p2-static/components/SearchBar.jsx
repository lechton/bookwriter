export default function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" /> Only show drinks in stock
      </label>
    </form>
  );
}
