export function checkCode(code) {
  globalThis.checkCalls = (globalThis.checkCalls ?? 0) + 1;
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
