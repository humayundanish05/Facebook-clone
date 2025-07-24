// Optional: Add interactivity later
document.querySelector('.fab').addEventListener('click', () => {
  alert('Create a new chat (functionality coming soon)');
});

document.getElementById('searchInput').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const messages = document.querySelectorAll('.message');

  messages.forEach(msg => {
    const name = msg.querySelector('strong')?.innerText.toLowerCase() || '';
    const preview = msg.querySelector('span')?.innerText.toLowerCase() || '';
    
    if (name.includes(query) || preview.includes(query)) {
      msg.style.display = 'flex';
    } else {
      msg.style.display = 'none';
    }
  });
});

