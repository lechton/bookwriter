export async function deliverMessage(text) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return text;
}
