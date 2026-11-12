const emailBox = document.getElementById('email');
const statusText = document.getElementById('status');
const errorText = document.getElementById('error');
const doneText = document.getElementById('done');

function handleSubscribe() {
  statusText.textContent = 'Subscribing...';
  setTimeout(() => {
    statusText.textContent = '';
    if (emailBox.value === 'john@example.com') {
      errorText.textContent = 'This email is already subscribed.';
    } else {
      doneText.textContent = 'You are subscribed!';
    }
  }, 1500);
}

document.getElementById('subscribe').addEventListener('click', handleSubscribe);
