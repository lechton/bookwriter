import { useActionState } from 'react';
import { saveComment } from './api.js';
import CommentFooter from './CommentFooter.jsx';

async function addComment(previousComments, formData) {
  const comment = await saveComment(formData.get('comment'));
  return [...previousComments, comment];
}

export default function CommentSection() {
  const [comments, postAction, isPending] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]);
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      <form action={postAction}>
        <input name="comment" placeholder="Add a comment..." />
        <CommentFooter pending={isPending} />
      </form>
    </section>
  );
}
