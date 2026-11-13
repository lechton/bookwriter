import { useFormStatus } from 'react';

export default function PostButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Posting...' : 'Post'}</button>;
}
