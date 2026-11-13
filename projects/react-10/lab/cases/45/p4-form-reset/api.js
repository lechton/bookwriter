const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (takenUsernames.includes(username)) { // john is taken
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null); // Any other name is free
      }
    }, 1000);
  });
}
