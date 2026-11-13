import PostButton from './PostButton.jsx';

export default function CommentFooter({ pending }) {
  return (
    <div>
      <PostButton pending={pending} />
    </div>
  );
}
