import { useFormStatus } from 'react-dom';
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  const { data } = useFormStatus();
  return (
    <div>
      {data && <p>Posting "{data.get('comment')}"...</p>}
      <PostButton />
    </div>
  );
}
