import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

async function updateLike(wasLiked, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? nextLiked : wasLiked;
}

export default function LikeButton() {
  const [liked, likeAction] = useActionState(updateLike, false);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);

  async function submitAction() {
    const nextLiked = !optimisticLiked;
    setOptimisticLiked(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{optimisticLiked ? '❤️ Liked' : '🤍 Like'}</button>
    </form>
  );
}
