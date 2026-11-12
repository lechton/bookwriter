const emailBox = document.getElementById('email');
const errorText = document.getElementById('error');
const doneText = document.getElementById('done');
const button = document.getElementById('subscribe');

function handleSubscribe() {
  button.disabled = true;
  setTimeout(() => {
    if (emailBox.value === 'john@example.com') {
      errorText.textContent = 'This email is already subscribed.';
    } else {
      doneText.textContent = 'You are subscribed!';
    }
  }, 1500);
}

document.getElementById('subscribe').addEventListener('click', handleSubscribe);
