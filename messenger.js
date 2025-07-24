// === FAB click ===
document.querySelector('.fab').addEventListener('click', () => {
  alert('Create a new chat (functionality coming soon)');
});

// === Search filter ===
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

// === Open chat when clicking on a message ===
document.querySelectorAll(".message").forEach((msg) => {
  msg.addEventListener("click", () => {
    const chatWindow = document.querySelector(".chat-window");
    const name = msg.querySelector("strong").textContent;
    const img = msg.querySelector("img").getAttribute("src");

    document.getElementById("chat-name").textContent = name;
    chatWindow.querySelector(".chat-avatar").src = img;

    // Show chat and hide list/FAB
    chatWindow.classList.remove("hidden");
    document.querySelector(".message-list").style.display = "none";
    document.querySelector(".fab").style.display = "none";
  });
});

// === Back button functionality ===
document.querySelector('.back-btn').addEventListener('click', () => {
  document.querySelector('.chat-window').classList.add('hidden');
  document.querySelector('.message-list').style.display = 'block';
  document.querySelector('.fab').style.display = 'block';
});
