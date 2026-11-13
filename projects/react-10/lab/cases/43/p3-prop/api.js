let nextId = 1;

export async function saveComment(text) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: nextId++, text };
}
