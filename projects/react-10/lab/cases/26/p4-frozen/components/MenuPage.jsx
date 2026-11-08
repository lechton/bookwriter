import { useState } from 'react';
import SearchBar from './SearchBar.jsx';
import DrinkList from './DrinkList.jsx';

export default function MenuPage({ drinks }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar filterText={filterText} inStockOnly={inStockOnly} />
      <DrinkList drinks={drinks} filterText={filterText} inStockOnly={inStockOnly} />
    </div>
  );
}
