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

// === Open chat on message click (single clean version) ===
document.querySelectorAll(".message").forEach(msg => {
  msg.addEventListener("click", () => {
    const chatWindow = document.querySelector(".chat-window");
    const name = msg.querySelector("strong").textContent;
    const imgSrc = msg.querySelector("img").getAttribute("src");

    document.getElementById("chat-name").textContent = name;
    chatWindow.querySelector(".chat-avatar").src = imgSrc;

    // Show chat window and hide other UI
    chatWindow.classList.remove("hidden");
    document.querySelector(".message-list").style.display = "none";
    document.querySelector(".fab").style.display = "none";
    document.querySelector(".nav-row")?.classList.add("hidden");
    document.querySelector(".info-row")?.classList.add("hidden");
    document.querySelector(".bottom-bar")?.classList.add("hidden");
  });
});

// === Back button (single complete version) ===
document.querySelector(".back-btn").addEventListener("click", () => {
  document.querySelector(".chat-window").classList.add("hidden");
  document.querySelector(".message-list").style.display = "block";
  document.querySelector(".fab").style.display = "block";
  document.querySelector(".nav-row")?.classList.remove("hidden");
  document.querySelector(".info-row")?.classList.remove("hidden");
  document.querySelector(".bottom-bar")?.classList.remove("hidden");
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


// Ensure messages scroll when keyboard opens on mobile
const inputField = document.getElementById("messageInput");

inputField.addEventListener("focus", () => {
  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 300);
});


// Fake reply messages
const fakeReplies = [

  "Haha okay 😄",
  "I'll check it and let you know.",
  "Busy right now, talk later!",
  "Sounds good to me!",
  "Can you send that again?",
  "😂😂😂",
  "Hmm, interesting...",
  "I agree!",
  "No way, really?",
  "Just saw it!",
  "That’s crazy!",
  "What do you mean?",
  "Let me think about it.",
  "Haha good one!",
  "I was just about to say that!",
  "Where are you now?",
  "I’m on my way.",
  "Let’s catch up later!",
  "Exactly!",
  "You're right!",
  "Wait what? 😳",
  "I didn’t expect that!",
  "Let me get back to you.",
  "Cool cool 😎",
  "Just woke up 💤",
  "I’m tired today 😩",
  "Same here!",
  "Oh really? Tell me more.",
  "Lol that’s wild 😂",
  "I knew it!",
  "This is getting interesting 🤔",
  "Brb",
  "I’m in a meeting right now.",
  "I’ll call you in a bit.",
  "Tell me everything!",
  "Okay let’s do it!",
  "What happened next?",
  "Omg 😱",
  "That made me laugh hard 😂",
  "Good luck!",
  "Hope you’re doing okay.",
  "Let’s plan something soon!",
  "Why not?",
  "Haha stop it 🤭",
  "You always say that 😂",
  "Nah, I don’t believe it!",
  "Send pic!",
  "Wait, you’re serious?",
  "Love it ❤️",
  "Don’t be shy lol"

];

// Fake user reply
function sendFakeReply() {
  const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
  
  const replyDiv = document.createElement("div");
  replyDiv.className = "message incoming";
  replyDiv.textContent = reply;

  messages.appendChild(replyDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Hook into the send button
document.getElementById("sendBtn").addEventListener("click", () => {
  setTimeout(sendFakeReply, 1500); // Delay 1.5 seconds for realism
});

// Also hook into "Enter" key if used
document.getElementById("messageInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    setTimeout(sendFakeReply, 1500);
  }
});
