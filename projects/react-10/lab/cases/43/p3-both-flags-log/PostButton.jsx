import { useFormStatus } from 'react-dom';

export default function PostButton({ pending: isPending }) {
  const status = useFormStatus();
  console.log('PostButton renders: isPending=' + isPending + ' pending=' + status.pending + ' method=' + status.method + ' action=' + (status.action === null ? 'null' : typeof status.action) + ' data=' + (status.data === null ? 'null' : status.data.get('comment')));
  return (
    <button type="submit" disabled={isPending}>
      {isPending ? 'Posting...' : 'Post'}
    </button>
  );
}
