import DrinkRow from './DrinkRow.jsx';

export default function DrinkList({ drinks }) {
  return (
    <ul>
      {drinks.map(drink => <DrinkRow key={drink.id} drink={drink} />)}
    </ul>
  );
}
