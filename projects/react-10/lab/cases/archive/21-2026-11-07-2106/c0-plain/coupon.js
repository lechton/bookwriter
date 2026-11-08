const box = document.getElementById('code');
const errorText = document.getElementById('error');
const successText = document.getElementById('success');

document.getElementById('apply').addEventListener('click', () => {
  if (box.value === 'SAVE10') {
    successText.hidden = false;
  } else {
    errorText.hidden = false;
  }
});
