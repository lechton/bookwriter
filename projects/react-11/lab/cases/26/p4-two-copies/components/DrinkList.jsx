import { useState } from 'react';
import DrinkRow from './DrinkRow.jsx';

export default function DrinkList({ drinks }) {
  const [filterText, setFilterText] = useState('');
  const visibleDrinks = drinks.filter(drink => drink.name.toLowerCase().includes(filterText.toLowerCase()));
  return (
    <ul>
      {visibleDrinks.map(drink => <DrinkRow key={drink.id} drink={drink} />)}
    </ul>
  );
}
