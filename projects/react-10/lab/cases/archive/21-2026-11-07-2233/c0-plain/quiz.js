const box = document.getElementById('answer');
const button = document.getElementById('check');
const rightText = document.getElementById('right');
const wrongText = document.getElementById('wrong');

button.addEventListener('click', () => {
  if (box.value === 'Paris') {
    rightText.hidden = false;
  } else {
    wrongText.hidden = false;
  }
});
