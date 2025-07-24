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

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const messages = document.querySelectorAll(".message-list .message");
  const chatWindow = document.querySelector(".chat-window");
  const chatUserInfo = chatWindow.querySelector(".chat-user-info");
  const chatMeta = chatUserInfo.querySelector(".chat-meta");
  const chatAvatar = chatUserInfo.querySelector("img");
  const chatMessages = chatWindow.querySelector(".chat-messages");

  messages.forEach(msg => {
    msg.addEventListener("click", () => {
      const name = msg.querySelector("strong").textContent;
      const text = msg.querySelector("span").textContent;
      const imgSrc = msg.querySelector("img").getAttribute("src");

      // Update header info
      chatAvatar.setAttribute("src", imgSrc);
      chatMeta.querySelector("strong").textContent = name;
      chatMeta.querySelector(".last-active").textContent = "Active recently";

      // Clear previous messages
      chatMessages.innerHTML = "";

      // Add demo messages
      chatMessages.innerHTML = `
        <div class="message incoming">${text}</div>
        <div class="message outgoing">Hi ${name.split(" ")[0]}, how are you?</div>
      `;

      // Show chat window (especially for mobile)
      chatWindow.classList.add("active");

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });

  // Back button (for mobile)
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      chatWindow.classList.remove("active");
    });
  }
});
