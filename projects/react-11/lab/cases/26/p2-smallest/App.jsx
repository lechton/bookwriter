function DrinkRow({ drink }) {
  return <li>{drink.name} {drink.price}</li>;
}

export default function App() {
  return <ul><DrinkRow drink={{ name: 'Tea', price: '$2' }} /></ul>;
}
