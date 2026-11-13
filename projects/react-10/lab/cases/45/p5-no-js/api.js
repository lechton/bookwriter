const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (takenUsernames.includes(username)) {
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
