import { useFormStatus } from 'react-dom';
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  const { data } = useFormStatus();
  return (
    <div>
      <p>Posting "{data.get('comment')}"...</p>
      <PostButton />
    </div>
  );
}
