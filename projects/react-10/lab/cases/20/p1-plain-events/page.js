const messageBox = document.getElementById('message');
messageBox.addEventListener('change', e => console.log('change:', e.target.value));
messageBox.addEventListener('input', e => console.log('input:', e.target.value));
