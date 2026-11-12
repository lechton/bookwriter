const button = document.getElementById('subscribe');
const thanks = document.getElementById('thanks');
const note = document.getElementById('note');

button.addEventListener('click', () => {
  button.disabled = true;
  thanks.classList.remove('hidden');
  note.classList.add('hidden');
});
