import PostButton from './PostButton.jsx';

export default function CommentFooter({ pending }) {
  return (
    <div>
      <CommentActions />
    </div>
  );
}

function CommentActions({ pending }) {
  return <PostButton pending={pending} />;
}
