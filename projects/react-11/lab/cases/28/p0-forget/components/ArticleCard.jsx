import ActionBar from './ActionBar.jsx';

export default function ArticleCard({ theme }) {
  return (
    <article>
      <h2>New Park Opens</h2>
      <ActionBar theme={theme} />
    </article>
  );
}
