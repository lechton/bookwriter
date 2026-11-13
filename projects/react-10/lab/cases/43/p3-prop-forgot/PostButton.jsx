export default function PostButton({ pending }) {
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Posting...' : 'Post'}
    </button>
  );
}
