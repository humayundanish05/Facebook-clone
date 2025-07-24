// === FAB click ===
document.querySelector('.fab').addEventListener('click', () => {
  alert('Start new chat — functionality coming soon.');
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

// === Open chat on message click ===
document.querySelectorAll(".message").forEach(msg => {
  msg.addEventListener("click", () => {
    const chatWindow = document.querySelector(".chat-window");
    const name = msg.querySelector("strong").textContent;
    const imgSrc = msg.querySelector("img").getAttribute("src");

    document.getElementById("chat-name").textContent = name;
    chatWindow.querySelector(".chat-avatar").src = imgSrc;

    chatWindow.classList.remove("hidden");
    document.querySelector(".message-list").style.display = "none";
    document.querySelector(".fab").style.display = "none";
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

    // Show chat window
    chatWindow.classList.remove("hidden");

    // Hide message list, fab, nav, info-row, and bottom bar
    document.querySelector(".message-list").style.display = "none";
    document.querySelector(".fab").style.display = "none";
    document.querySelector(".nav-row").classList.add("hidden");
    document.querySelector(".info-row").classList.add("hidden");
    document.querySelector(".bottom-bar").classList.add("hidden");
  });
});

// === Back button functionality ===
document.querySelector(".back-btn").addEventListener("click", () => {
  document.querySelector(".chat-window").classList.add("hidden");
  document.querySelector(".message-list").style.display = "block";
  document.querySelector(".fab").style.display = "block";
  document.querySelector(".nav-row").classList.remove("hidden");
  document.querySelector(".info-row").classList.remove("hidden");
  document.querySelector(".bottom-bar").classList.remove("hidden");
});


// === Back button ===
document.querySelector(".back-btn").addEventListener("click", () => {
  document.querySelector(".chat-window").classList.add("hidden");
  document.querySelector(".message-list").style.display = "block";
  document.querySelector(".fab").style.display = "block";
});

// === Sending messages ===
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;

  const message = document.createElement("div");
  message.className = "message outgoing";
  message.textContent = text;
  messages.appendChild(message);

  input.value = "";
  messages.scrollTop = messages.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// === Sending image from gallery ===
const imageInput = document.getElementById("imageInput");

imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "sent-image";

      const msgDiv = document.createElement("div");
      msgDiv.className = "message outgoing";
      msgDiv.appendChild(img);

      messages.appendChild(msgDiv);
      messages.scrollTop = messages.scrollHeight;
    };
    reader.readAsDataURL(file);
  }
});

// === Like Button ===
document.querySelector(".like-btn").addEventListener("click", () => {
  const like = document.createElement("div");
  like.className = "message outgoing";
  like.innerHTML = "👍";
  messages.appendChild(like);
  messages.scrollTop = messages.scrollHeight;
});
