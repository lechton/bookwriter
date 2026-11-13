import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveComment } from './api.js';

async function addComment(previousComments, formData) {
  const comment = await saveComment(formData.get('comment'));
  return [...previousComments, comment];
}

export default function CommentSection() {
  const [comments, postAction] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]);
  const { pending } = useFormStatus();
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      <form action={postAction}>
        <input name="comment" placeholder="Add a comment..." />
        <button type="submit" disabled={pending}>
          {pending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </section>
  );
}
