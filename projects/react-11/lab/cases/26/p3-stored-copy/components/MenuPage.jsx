import { useState } from 'react';

export default function MenuPage({ drinks }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visibleDrinks, setVisibleDrinks] = useState(drinks);
  return (
    <div>
      <form>
        <input
          type="text"
          value={filterText}
          placeholder="Search..."
          onChange={(e) => {
            setFilterText(e.target.value);
            setVisibleDrinks(drinks.filter(drink => drink.name.toLowerCase().includes(e.target.value.toLowerCase())));
          }}
        />
        <label>
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> Only show drinks in stock
        </label>
      </form>
      <ul>
        {visibleDrinks.map(drink => <li key={drink.id}>{drink.name} {drink.price}{!drink.inStock && ' Sold out'}</li>)}
      </ul>
    </div>
  );
}
