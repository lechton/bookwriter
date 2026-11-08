import { useState } from 'react';

const DRINKS = [
  { id: 1, name: 'Coffee', price: '$3', inStock: true },
  { id: 2, name: 'Tea', price: '$2', inStock: true },
  { id: 3, name: 'Hot chocolate', price: '$4', inStock: false },
  { id: 4, name: 'Lemonade', price: '$3', inStock: true },
  { id: 5, name: 'Iced tea', price: '$3', inStock: false },
];

function DrinkList({ filterText }) {
  return <ul>{DRINKS.filter(d => d.name.toLowerCase().includes(filterText.toLowerCase())).map(d => <li key={d.id}>{d.name} {d.price}</li>)}</ul>;
}

function MenuPage() {
  const [filterText, setFilterText] = useState('tea');
  return (
    <div>
      <input value={filterText} />
      <DrinkList filterText={filterText} />
    </div>
  );
}

export default function App() {
  return <MenuPage />;
}
