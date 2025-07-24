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
    msg.style.display = (name.includes(query) || preview.includes(query)) ? 'flex' : 'none';
  });
});

// === Open chat on message click ===
document.querySelectorAll(".message").forEach(msg => {
  msg.addEventListener("click", () => {
    const chatWindow = document.querySelector(".chat-window");
    const name = msg.querySelector("strong")?.textContent || "";
    const imgSrc = msg.querySelector("img")?.getAttribute("src") || "";

    document.getElementById("chat-name").textContent = name;
    chatWindow.querySelector(".chat-avatar").src = imgSrc;

    chatWindow.classList.remove("hidden");
    document.querySelector(".message-list").style.display = "none";
    document.querySelector(".fab").style.display = "none";
    document.querySelector(".nav-row")?.classList.add("hidden");
    document.querySelector(".info-row")?.classList.add("hidden");
    document.querySelector(".bottom-bar")?.classList.add("hidden");
  });
});

// === Back button ===
document.querySelector(".back-btn").addEventListener("click", () => {
  document.querySelector(".chat-window").classList.add("hidden");
  document.querySelector(".message-list").style.display = "block";
  document.querySelector(".fab").style.display = "block";
  document.querySelector(".nav-row")?.classList.remove("hidden");
  document.querySelector(".info-row")?.classList.remove("hidden");
  document.querySelector(".bottom-bar")?.classList.remove("hidden");
});

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const messages = document.getElementById("chatMessages");

function addFakeMessage(text, isIncoming = true) {
  const msg = document.createElement("div");
  msg.className = `message ${isIncoming ? 'incoming' : 'outgoing'}`;
  msg.textContent = text;
  messages.appendChild(msg);
  addReactionsToMessages();
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (text === "") return;
  addFakeMessage(text, false);
  input.value = "";
}

sendBtn.addEventListener("click", () => {
  sendMessage();
  setTimeout(sendFakeReply, 1500);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
    setTimeout(sendFakeReply, 1500);
  }
});

// Scroll fix for mobile
input.addEventListener("focus", () => {
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 300);
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

      addReactionsToMessages();
      messages.scrollTop = messages.scrollHeight;
    };
    reader.readAsDataURL(file);
  }
});


// === Like Button ===
document.querySelector(".like-btn").addEventListener("click", () => {
  addFakeMessage("👍", false);
});

// === Fake replies ===
const fakeReplies = [
  "Haha okay 😄", "I'll check it and let you know.", "Busy right now, talk later!",
  "Sounds good to me!", "Can you send that again?", "😂😂😂", "Hmm, interesting...",
  "I agree!", "No way, really?", "Just saw it!", "That’s crazy!", "What do you mean?",
  "Let me think about it.", "Haha good one!", "Where are you now?", "I’m on my way.",
  "Let’s catch up later!", "Exactly!", "You're right!", "Wait what? 😳", "Cool cool 😎",
  "I’m tired today 😩", "Same here!", "Oh really? Tell me more.", "Lol that’s wild 😂",
  "Good luck!", "Hope you’re doing okay.", "Let’s plan something soon!", "Why not?",
  "Haha stop it 🤭", "You always say that 😂", "Love it ❤️", "Don’t be shy lol"
];

function sendFakeReply() {
  const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
  addFakeMessage(reply, true);
}


function addReactionsToMessages() {
  document.querySelectorAll(".message").forEach(msg => {
    msg.addEventListener("contextmenu", e => e.preventDefault()); // prevent long press copy
    msg.addEventListener("touchstart", e => e.preventDefault());

    if (msg.querySelector(".reaction-bar")) return;

    const bar = document.createElement("div");
    bar.className = "reaction-bar hidden";
    bar.innerHTML = `
      <span class="reaction">👍</span>
      <span class="reaction">❤️</span>
      <span class="reaction">😂</span>
      <span class="reaction">😮</span>
      <span class="reaction">😢</span>
      <span class="reaction">😡</span>
    `;
    msg.appendChild(bar);

    msg.addEventListener("click", (e) => {
      if (!e.target.classList.contains("reaction")) {
        document.querySelectorAll(".reaction-bar").forEach(b => b.classList.add("hidden"));
        bar.classList.toggle("hidden");
      }
    });
  });
}

// Handle reaction click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("reaction")) {
    const emoji = e.target.textContent;
    const msg = e.target.closest(".message");

    let existing = msg.querySelector(".message-reaction");
    if (!existing) {
      existing = document.createElement("div");
      existing.className = "message-reaction";
      msg.appendChild(existing);
    }
    existing.textContent = emoji;
    msg.querySelector(".reaction-bar").classList.add("hidden");
  }
});

// Run after load
addReactionsToMessages();
