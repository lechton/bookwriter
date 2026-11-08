const button = document.getElementById('subscribe');
const thanks = document.getElementById('thanks');

button.addEventListener('click', () => {
  button.disabled = true;
  thanks.classList.remove('hidden');
});
