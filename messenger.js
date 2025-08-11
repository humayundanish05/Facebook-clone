// messenger.js — fixed & improved
let currentChatName = "User";

// === Elements ===
const fab = document.querySelector(".fab");
const modal = document.getElementById("newChatModal");
const createBtn = document.getElementById("createChatBtn");
const cancelBtn = document.getElementById("cancelChatBtn");
const nameInput = document.getElementById("newChatName");
const messageList = document.querySelector(".message-list");
const chatWindow = document.querySelector(".chat-window");
const chatNameEl = document.getElementById("chat-name");
const chatAvatarEl = document.querySelector(".chat-avatar");
const chatMessagesEl = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");
const likeBtn = document.querySelector(".like-btn");
const searchInput = document.getElementById("searchInput");

// avatar pool
const avatarURLs = [
  "https://i.pravatar.cc/150?img=1", "https://i.pravatar.cc/150?img=2", "https://i.pravatar.cc/150?img=3", "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5", "https://i.pravatar.cc/150?img=6", "https://i.pravatar.cc/150?img=7", "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9", "https://i.pravatar.cc/150?img=10", "https://i.pravatar.cc/150?img=11", "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13", "https://i.pravatar.cc/150?img=14", "https://i.pravatar.cc/150?img=15", "https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=17", "https://i.pravatar.cc/150?img=18", "https://i.pravatar.cc/150?img=19", "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=21", "https://i.pravatar.cc/150?img=22", "https://i.pravatar.cc/150?img=23", "https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=25", "https://i.pravatar.cc/150?img=26", "https://i.pravatar.cc/150?img=27", "https://i.pravatar.cc/150?img=28",
  "https://i.pravatar.cc/150?img=29", "https://i.pravatar.cc/150?img=30", "https://i.pravatar.cc/150?img=31", "https://i.pravatar.cc/150?img=32",
  "https://i.pravatar.cc/150?img=33", "https://i.pravatar.cc/150?img=34", "https://i.pravatar.cc/150?img=35", "https://i.pravatar.cc/150?img=36",
  "https://i.pravatar.cc/150?img=37", "https://i.pravatar.cc/150?img=38", "https://i.pravatar.cc/150?img=39", "https://i.pravatar.cc/150?img=40",
  "https://i.pravatar.cc/150?img=41", "https://i.pravatar.cc/150?img=42", "https://i.pravatar.cc/150?img=43", "https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=45", "https://i.pravatar.cc/150?img=46", "https://i.pravatar.cc/150?img=47", "https://i.pravatar.cc/150?img=48",
  "https://i.pravatar.cc/150?img=49", "https://i.pravatar.cc/150?img=50", "https://i.pravatar.cc/150?img=51", "https://i.pravatar.cc/150?img=52",
  "https://i.pravatar.cc/150?img=53", "https://i.pravatar.cc/150?img=54", "https://i.pravatar.cc/150?img=55", "https://i.pravatar.cc/150?img=56",
  "https://i.pravatar.cc/150?img=57", "https://i.pravatar.cc/150?img=58", "https://i.pravatar.cc/150?img=59", "https://i.pravatar.cc/150?img=60",
  "https://i.pravatar.cc/150?img=61", "https://i.pravatar.cc/150?img=62", "https://i.pravatar.cc/150?img=63", "https://i.pravatar.cc/150?img=64",
  "https://i.pravatar.cc/150?img=65", "https://i.pravatar.cc/150?img=66", "https://i.pravatar.cc/150?img=67", "https://i.pravatar.cc/150?img=68",
  "https://i.pravatar.cc/150?img=69", "https://i.pravatar.cc/150?img=70"
];

// saved chats & history
let savedChats = JSON.parse(localStorage.getItem("chats")) || [];
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};

// === Utilities ===
function saveChatsToStorage() {
  localStorage.setItem("chats", JSON.stringify(savedChats));
}
function saveHistoryToStorage() {
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// === Modal / FAB ===
fab?.addEventListener("click", () => {
  modal.classList.remove("hidden");
  nameInput.value = "";
  nameInput.focus();
});
cancelBtn?.addEventListener("click", () => modal.classList.add("hidden"));

// Create chat
createBtn?.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter a name.");
  if (savedChats.some(c => c.name === name)) return alert("Chat with this name already exists.");

  const avatar = avatarURLs[Math.floor(Math.random() * avatarURLs.length)];
  const newChat = { name, avatar };
  savedChats.push(newChat);
  saveChatsToStorage();

  renderChatItem(newChat);
  modal.classList.add("hidden");
});

// === Render chat item (for message list) ===
function renderChatItem({ name, avatar }) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `
    <img src="${avatar}" alt="${name}" />
    <div class="message-content">
      <strong>${name}</strong><br/>
      <span>Start your conversation</span>
    </div>
    <button class="dots-button" aria-label="Options">&#8942;</button>
  `;

  // prepend to list
  messageList.prepend(msg);

  // (No individual click listeners here — we use delegation below)
}

// === Enhance existing static messages (append dots button if missing) ===
function enhanceExistingMessages() {
  const msgs = messageList.querySelectorAll(".message");
  msgs.forEach(m => {
    if (!m.querySelector(".dots-button")) {
      const btn = document.createElement("button");
      btn.className = "dots-button";
      btn.setAttribute("aria-label", "Options");
      btn.innerHTML = "&#8942;";
      m.appendChild(btn);
    }
  });
}

// === Delegated click handling for message-list (handles static + dynamic) ===
messageList?.addEventListener("click", (e) => {
  const msgEl = e.target.closest(".message");
  if (!msgEl) return;

  // If dots button clicked
  if (e.target.closest(".dots-button")) {
    e.stopPropagation();
    const name = msgEl.querySelector("strong")?.innerText || "Unknown";
    // TODO: Replace alert with actual contextual menu
    alert(`Options for ${name}\n(You can implement edit/delete/mark-as-read here)`);
    return;
  }

  // Otherwise, open chat
  const name = msgEl.querySelector("strong")?.innerText || "User";
  const imgSrc = msgEl.querySelector("img")?.getAttribute("src") || "";
  openChatWindow(name, imgSrc);
});

// === Open chat window & load history ===
function openChatWindow(name, avatar) {
  currentChatName = name;
  chatNameEl.textContent = name;
  if (avatar && chatAvatarEl) chatAvatarEl.src = avatar;

  chatMessagesEl.innerHTML = "";

  const messages = chatHistory[name] || [];
  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.type}`;
    if (msg.type === "image") {
      const img = document.createElement("img");
      img.src = msg.text;
      img.className = "sent-image";
      div.appendChild(img);
    } else {
      div.textContent = msg.text;
    }
    chatMessagesEl.appendChild(div);
  });

  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

  chatWindow.classList.remove("hidden");
  messageList.style.display = "none";
  fab.style.display = "none";
  document.querySelector(".nav-row")?.classList.add("hidden");
  document.querySelector(".info-row")?.classList.add("hidden");
  document.querySelector(".bottom-bar")?.classList.add("hidden");
}

// === Back / close chat (use existing forward-btn element as back) ===
const backBtn = document.querySelector(".back-btn") || document.querySelector(".forward-btn");
backBtn?.addEventListener("click", () => {
  chatWindow.classList.add("hidden");
  messageList.style.display = "block";
  fab.style.display = "block";
  document.querySelector(".nav-row")?.classList.remove("hidden");
  document.querySelector(".info-row")?.classList.remove("hidden");
  document.querySelector(".bottom-bar")?.classList.remove("hidden");
});

// === Search filter (limit to message-list only) ===
searchInput?.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const messages = messageList.querySelectorAll('.message');

  messages.forEach(msg => {
    const name = msg.querySelector('strong')?.innerText.toLowerCase() || '';
    const preview = msg.querySelector('span')?.innerText.toLowerCase() || '';

    if (name.includes(query) || preview.includes(query)) {
      msg.style.display = ''; // restore default
    } else {
      msg.style.display = 'none';
    }
  });
});

// === Sending messages & persistence ===
function appendMessageToChatUI(text, type = "outgoing") {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessagesEl.appendChild(message);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function saveMessageToHistory(name, text, type = "outgoing") {
  if (!chatHistory[name]) chatHistory[name] = [];
  chatHistory[name].push({ text, type });
  saveHistoryToStorage();
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  appendMessageToChatUI(text, "outgoing");
  saveMessageToHistory(currentChatName, text, "outgoing");
  input.value = "";
  setTimeout(sendFakeReply, 1500);
}

sendBtn?.addEventListener("click", sendMessage);
input?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// === Image sending (with persistence) ===
imageInput?.addEventListener("change", function () {
  const file = this.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      const img = document.createElement("img");
      img.src = dataUrl;
      img.className = "sent-image";

      const msgDiv = document.createElement("div");
      msgDiv.className = "message outgoing";
      msgDiv.appendChild(img);
      chatMessagesEl.appendChild(msgDiv);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

      // Save as image message
      if (currentChatName) {
        if (!chatHistory[currentChatName]) chatHistory[currentChatName] = [];
        chatHistory[currentChatName].push({ text: dataUrl, type: "image" });
        saveHistoryToStorage();
      }
    };
    reader.readAsDataURL(file);
  }
});

// === Like button (thumb) persisted ===
likeBtn?.addEventListener("click", () => {
  appendMessageToChatUI("👍", "outgoing");
  saveMessageToHistory(currentChatName, "👍", "outgoing");
});

// === Mobile scroll fix on input focus ===
input?.addEventListener("focus", () => {
  setTimeout(() => {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }, 300);
});

// === Fake replies ===
const fakeReplies = [
  "Haha okay 😄", "I'll check it and let you know.", "Busy right now, talk later!",
  "Sounds good to me!", "Can you send that again?", "😂😂😂", "Hmm, interesting...",
  "I agree!", "No way, really?", "Just saw it!", "That’s crazy!", "What do you mean?",
  "Let me think about it.", "Haha good one!", "I was just about to say that!",
  "Where are you now?", "I’m on my way.", "Let’s catch up later!", "Exactly!",
  "You're right!", "Wait what? 😳", "I didn’t expect that!", "Let me get back to you.",
  "Cool cool 😎", "Just woke up 💤", "I’m tired today 😩", "Same here!",
  "Oh really? Tell me more.", "Lol that’s wild 😂", "I knew it!",
  "This is getting interesting 🤔", "Brb", "I’m in a meeting right now.",
  "I’ll call you in a bit.", "Tell me everything!", "Okay let’s do it!",
  "What happened next?", "Omg 😱", "That made me laugh hard 😂", "Good luck!",
  "Hope you’re doing okay.", "Let’s plan something soon!", "Why not?",
  "Haha stop it 🤭", "You always say that 😂", "Nah, I don’t believe it!",
  "Send pic!", "Wait, you’re serious?", "Love it ❤️", "Don’t be shy lol"
];

function sendFakeReply() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.textContent = `${currentChatName} is typing...`;
  chatMessagesEl.appendChild(typingDiv);
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();
    const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
    const replyDiv = document.createElement("div");
    replyDiv.className = "message incoming";
    replyDiv.textContent = reply;
    chatMessagesEl.appendChild(replyDiv);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    // save incoming
    if (currentChatName) {
      if (!chatHistory[currentChatName]) chatHistory[currentChatName] = [];
      chatHistory[currentChatName].push({ text: reply, type: "incoming" });
      saveHistoryToStorage();
    }
  }, 1500);
}

// === Initial load: render saved chats + enhance static messages ===
window.addEventListener("DOMContentLoaded", () => {
  // Render saved chats (they will appear at top)
  savedChats.forEach(chat => renderChatItem(chat));

  // Add dots buttons to existing static messages
  enhanceExistingMessages();
});
