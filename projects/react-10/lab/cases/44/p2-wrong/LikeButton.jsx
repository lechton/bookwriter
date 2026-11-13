import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

async function updateLike(wasLiked, nextLiked) {
  await saveLike(nextLiked);
  return nextLiked;
}

export default function LikeButton() {
  const [liked, likeAction] = useActionState(updateLike, false);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);

  async function submitAction() {
    return likeAction(!liked);
  }

  return (
    <form action={submitAction}>
      <button
        type="submit"
        onClick={() => setOptimisticLiked(!optimisticLiked)}
      >
        {optimisticLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </form>
  );
}
