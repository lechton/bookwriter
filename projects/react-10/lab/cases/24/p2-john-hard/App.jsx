import NameBox from './components/NameBox.jsx';
import BadgePreview from './components/BadgePreview.jsx';

export default function App() {
  return (
    <>
      <h1>Make a Name Badge</h1>
      <NameBox firstName="John" />
      <BadgePreview firstName="John" />
    </>
  );
}
