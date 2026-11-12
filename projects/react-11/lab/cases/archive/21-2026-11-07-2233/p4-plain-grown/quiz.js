const box = document.getElementById('answer');
const button = document.getElementById('check');
const rightText = document.getElementById('right');
const wrongText = document.getElementById('wrong');
const checkingText = document.getElementById('checking');

button.addEventListener('click', () => {
  box.disabled = true;
  button.disabled = true;
  checkingText.hidden = false;
  wrongText.hidden = true;
  setTimeout(() => {
    box.disabled = false;
    button.disabled = false;
    checkingText.hidden = true;
    if (box.value === 'Paris') {
      rightText.hidden = false;
    } else {
      wrongText.hidden = false;
    }
  }, 1000);
});
