import { useState } from 'react';

export default function SearchBar() {
  const [filterText, setFilterText] = useState('');
  return (
    <form>
      <input type="text" value={filterText} placeholder="Search..." onChange={(e) => setFilterText(e.target.value)} />
    </form>
  );
}
