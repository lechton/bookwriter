import { checkCode } from './checkCode.js';

const form = document.getElementById('promo-form');
const codeInput = document.getElementById('code-input');
const applyButton = document.getElementById('apply-button');
const checkingText = document.getElementById('checking');
const errorText = document.getElementById('error');
const successText = document.getElementById('success');

codeInput.addEventListener('input', () => {
  applyButton.disabled = codeInput.value.length === 0;
});

async function handleSubmit(e) {
  e.preventDefault();
  codeInput.disabled = true;
  applyButton.disabled = true;
  checkingText.classList.remove('hidden');
  try {
    await checkCode(codeInput.value);
    successText.classList.remove('hidden');
    form.classList.add('hidden');
  } catch {
    errorText.classList.remove('hidden');
  } finally {
    checkingText.classList.add('hidden');
    codeInput.disabled = false;
    applyButton.disabled = false;
  }
}

form.addEventListener('submit', handleSubmit);
