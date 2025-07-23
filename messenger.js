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

const previews = document.querySelectorAll('.chat-preview');
const chatWindow = document.querySelector('.chat-window');
const chatHeader = chatWindow.querySelector('.chat-header strong');
const messageContainer = chatWindow.querySelector('.chat-messages');

previews.forEach(preview => {
  preview.addEventListener('click', () => {
    // Remove old active
    previews.forEach(p => p.classList.remove('active'));
    preview.classList.add('active');

    // Get data
    const name = preview.dataset.name;
    const messages = JSON.parse(preview.dataset.messages);

    // Update header
    chatHeader.textContent = name;

    // Update messages
    messageContainer.innerHTML = '';
    messages.forEach((msg, index) => {
      const div = document.createElement('div');
      div.classList.add('message');
      div.classList.add(index % 2 === 0 ? 'incoming' : 'outgoing');
      div.textContent = msg;
      messageContainer.appendChild(div);
    });

    // Show chat window on mobile
    chatWindow.classList.add('active');
  });
});

// Back button for mobile
document.querySelector('.back-btn').addEventListener('click', () => {
  chatWindow.classList.remove('active');
});
