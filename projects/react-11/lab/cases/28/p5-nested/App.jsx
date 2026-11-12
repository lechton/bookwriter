import { ThemeContext } from './ThemeContext.js';
import ShareButton from './components/ShareButton.jsx';

export default function App() {
  return (
    <ThemeContext value="dark">
      <ShareButton />
      <ThemeContext value="light">
        <ShareButton />
      </ThemeContext>
    </ThemeContext>
  );
}
