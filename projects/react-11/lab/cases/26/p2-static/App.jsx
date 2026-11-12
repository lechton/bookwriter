import MenuPage from './components/MenuPage.jsx';

const DRINKS = [
  { id: 1, name: 'Coffee', price: '$3', inStock: true },
  { id: 2, name: 'Tea', price: '$2', inStock: true },
  { id: 3, name: 'Hot chocolate', price: '$4', inStock: false },
  { id: 4, name: 'Lemonade', price: '$3', inStock: true },
  { id: 5, name: 'Iced tea', price: '$3', inStock: false },
];

export default function App() {
  return (
    <main>
      <h1>Drinks</h1>
      <MenuPage drinks={DRINKS} />
    </main>
  );
}
