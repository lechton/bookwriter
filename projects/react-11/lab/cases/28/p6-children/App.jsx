import { useState } from 'react';
import Page from './components/Page.jsx';
import ArticleCard from './components/ArticleCard.jsx';
import ActionBar from './components/ActionBar.jsx';
import ShareButton from './components/ShareButton.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div>
      <button className={theme} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </button>
      <Page>
        <ArticleCard title="New Park Opens">
          <ActionBar>
            <ShareButton theme={theme} />
          </ActionBar>
        </ArticleCard>
      </Page>
    </div>
  );
}
