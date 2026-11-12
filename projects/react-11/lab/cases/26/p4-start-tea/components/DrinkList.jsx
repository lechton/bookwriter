import DrinkRow from './DrinkRow.jsx';

export default function DrinkList({ drinks, filterText, inStockOnly }) {
  const visibleDrinks = drinks.filter(drink => {
    if (inStockOnly && !drink.inStock) {
      return false;
    }
    return drink.name.toLowerCase().includes(filterText.toLowerCase());
  });
  return (
    <ul>
      {visibleDrinks.map(drink => <DrinkRow key={drink.id} drink={drink} />)}
    </ul>
  );
}
