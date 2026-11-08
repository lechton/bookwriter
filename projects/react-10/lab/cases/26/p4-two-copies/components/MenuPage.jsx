import SearchBar from './SearchBar.jsx';
import DrinkList from './DrinkList.jsx';

export default function MenuPage({ drinks }) {
  return (
    <div>
      <SearchBar />
      <DrinkList drinks={drinks} />
    </div>
  );
}
