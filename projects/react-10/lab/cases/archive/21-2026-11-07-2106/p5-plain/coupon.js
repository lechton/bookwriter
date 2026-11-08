const box = document.getElementById('code');
const errorText = document.getElementById('error');
const successText = document.getElementById('success');
const expiredText = document.getElementById('expired');

document.getElementById('apply').addEventListener('click', () => {
  if (box.value === 'SAVE10') {
    successText.hidden = false;
    errorText.hidden = true;
  } else if (box.value === 'SUMMER') {
    expiredText.hidden = false;
    errorText.hidden = true;
    successText.hidden = true;
  } else {
    errorText.hidden = false;
    successText.hidden = true;
    expiredText.hidden = true;
  }
});
