const emails = [];

export async function signUp(email) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (emails.includes(email)) {
    return 'This email is already signed up';
  }
  emails.push(email);
  return null;
}
