export default function DrinkRow({ drink }) {
  return <li>{drink.name} {drink.price}{!drink.inStock && ' Sold out'}</li>;
}
