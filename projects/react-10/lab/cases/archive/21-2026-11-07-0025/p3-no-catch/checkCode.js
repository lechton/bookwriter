export function checkCode(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === 'WELCOME') {
        resolve();
      } else {
        reject(new Error('This code is not valid.'));
      }
    }, 1500);
  });
}
