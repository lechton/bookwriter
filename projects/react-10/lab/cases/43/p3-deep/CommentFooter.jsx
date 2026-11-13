import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  return (
    <div>
      <CommentActions />
    </div>
  );
}

function CommentActions() {
  return <PostButton />;
}
