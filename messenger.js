// messenger.js — fixed & improved (with working 3-dots menu & persistent actions)

let currentChatName = "User";
let currentChatId = null;

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
  "https://i.pravatar.cc/150?img=1","https://i.pravatar.cc/150?img=2","https://i.pravatar.cc/150?img=3","https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5","https://i.pravatar.cc/150?img=6","https://i.pravatar.cc/150?img=7","https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9","https://i.pravatar.cc/150?img=10","https://i.pravatar.cc/150?img=11","https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=13","https://i.pravatar.cc/150?img=14","https://i.pravatar.cc/150?img=15","https://i.pravatar.cc/150?img=16",
  "https://i.pravatar.cc/150?img=17","https://i.pravatar.cc/150?img=18","https://i.pravatar.cc/150?img=19","https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=21","https://i.pravatar.cc/150?img=22","https://i.pravatar.cc/150?img=23","https://i.pravatar.cc/150?img=24",
  "https://i.pravatar.cc/150?img=25","https://i.pravatar.cc/150?img=26","https://i.pravatar.cc/150?img=27","https://i.pravatar.cc/150?img=28",
  "https://i.pravatar.cc/150?img=29","https://i.pravatar.cc/150?img=30","https://i.pravatar.cc/150?img=31","https://i.pravatar.cc/150?img=32",
  "https://i.pravatar.cc/150?img=33","https://i.pravatar.cc/150?img=34","https://i.pravatar.cc/150?img=35","https://i.pravatar.cc/150?img=36",
  "https://i.pravatar.cc/150?img=37","https://i.pravatar.cc/150?img=38","https://i.pravatar.cc/150?img=39","https://i.pravatar.cc/150?img=40",
  "https://i.pravatar.cc/150?img=41","https://i.pravatar.cc/150?img=42","https://i.pravatar.cc/150?img=43","https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=45","https://i.pravatar.cc/150?img=46","https://i.pravatar.cc/150?img=47","https://i.pravatar.cc/150?img=48",
  "https://i.pravatar.cc/150?img=49","https://i.pravatar.cc/150?img=50","https://i.pravatar.cc/150?img=51","https://i.pravatar.cc/150?img=52",
  "https://i.pravatar.cc/150?img=53","https://i.pravatar.cc/150?img=54","https://i.pravatar.cc/150?img=55","https://i.pravatar.cc/150?img=56",
  "https://i.pravatar.cc/150?img=57","https://i.pravatar.cc/150?img=58","https://i.pravatar.cc/150?img=59","https://i.pravatar.cc/150?img=60",
  "https://i.pravatar.cc/150?img=61","https://i.pravatar.cc/150?img=62","https://i.pravatar.cc/150?img=63","https://i.pravatar.cc/150?img=64",
  "https://i.pravatar.cc/150?img=65","https://i.pravatar.cc/150?img=66","https://i.pravatar.cc/150?img=67","https://i.pravatar.cc/150?img=68",
  "https://i.pravatar.cc/150?img=69","https://i.pravatar.cc/150?img=70"
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
function makeId() {
  return Date.now().toString(36) + Math.floor(Math.random()*10000).toString(36);
}
function findChatIndexById(id) {
  return savedChats.findIndex(c => c.id === id);
}
function findChatById(id) {
  return savedChats.find(c => c.id === id);
}

// Normalize savedChats: ensure id, unread, muted exist for older storage
function normalizeSavedChats() {
  let changed = false;
  savedChats = savedChats.map(c => {
    if (!c.id) {
      c.id = makeId();
      changed = true;
    }
    if (typeof c.unread === "undefined") {
      c.unread = false;
      changed = true;
    }
    if (typeof c.muted === "undefined") {
      c.muted = false;
      changed = true;
    }
    return c;
  });
  if (changed) saveChatsToStorage();
}

// === Global menu element (single menu used for all items) ===
const globalMenu = document.createElement('div');
globalMenu.className = 'dots-menu hidden';
globalMenu.innerHTML = `
  <button class="edit-chat">Edit Chat Name</button>
  <button class="delete-chat">Delete Chat</button>
  <button class="toggle-read">Mark as Read</button>
  <button class="mute-chat">Mute Chat</button>
`;
document.body.appendChild(globalMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dots-button') && !e.target.closest('.dots-menu')) {
    globalMenu.classList.add('hidden');
    currentMenuTargetId = null;
  }
});

// Track which chat the menu is open for
let currentMenuTargetId = null;

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
  const newChat = { id: makeId(), name, avatar, unread: false, muted: false };
  savedChats.push(newChat);
  saveChatsToStorage();

  renderChatItem(newChat);
  modal.classList.add("hidden");
});

// === Render chat item (for message list) ===
function renderChatItem({ id, name, avatar, unread, muted }) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.setAttribute("data-id", id);
  msg.innerHTML = `
    <img src="${avatar}" alt="${name}" />
    <div class="message-content">
      <strong>${name}</strong><br/>
      <span>Start your conversation</span>
    </div>
    <div class="message-actions">
      ${muted ? '<i class="fas fa-bell-slash mute-icon" title="Muted"></i>' : ''}
      ${unread ? '<span class="badge" title="Unread">•</span>' : ''}
      <button class="dots-button" aria-label="Options">&#8942;</button>
    </div>
  `;

  // prepend to list
  messageList.prepend(msg);

  // make sure message has menu & minimal event wiring handled globally
}

// === Update a single message element in DOM after changes ===
function updateMessageElement(chat) {
  const el = messageList.querySelector(`.message[data-id="${chat.id}"]`);
  if (!el) return;
  // update name
  const strong = el.querySelector('strong');
  if (strong) strong.innerText = chat.name;
  // update avatar
  const img = el.querySelector('img');
  if (img && chat.avatar) img.src = chat.avatar;

  // update actions (badge / mute)
  const actions = el.querySelector('.message-actions');
  if (actions) {
    // remove existing badge/mute icons then re-add
    const muteIcon = actions.querySelector('.mute-icon');
    if (muteIcon) muteIcon.remove();
    const badge = actions.querySelector('.badge');
    if (badge) badge.remove();
    // insert mute icon if muted
    if (chat.muted) {
      const i = document.createElement('i');
      i.className = 'fas fa-bell-slash mute-icon';
      i.title = 'Muted';
      actions.insertBefore(i, actions.firstChild);
    }
    if (chat.unread) {
      const s = document.createElement('span');
      s.className = 'badge';
      s.title = 'Unread';
      s.innerText = '•';
      actions.insertBefore(s, actions.firstChild);
    }
  }
}

// === Enhance existing static messages (append dots button if missing) ===
function enhanceExistingMessages() {
  const msgs = messageList.querySelectorAll(".message");
  msgs.forEach(m => {
    if (!m.querySelector(".dots-button")) {
      // append minimal actions wrapper
      const actions = document.createElement('div');
      actions.className = 'message-actions';
      const btn = document.createElement("button");
      btn.className = "dots-button";
      btn.setAttribute("aria-label", "Options");
      btn.innerHTML = "&#8942;";
      actions.appendChild(btn);
      m.appendChild(actions);
    }
  });
}

// === Position & open global menu for a given message id and button element ===
function openMenuForMessage(chatId, buttonEl) {
  currentMenuTargetId = chatId;
  const chat = findChatById(chatId);
  // adjust menu labels depending on state
  const toggleReadBtn = globalMenu.querySelector('.toggle-read');
  const muteBtn = globalMenu.querySelector('.mute-chat');
  if (chat) {
    toggleReadBtn.innerText = chat.unread ? 'Mark as Read' : 'Mark as Unread';
    muteBtn.innerText = chat.muted ? 'Unmute Chat' : 'Mute Chat';
  } else {
    // static message with no savedChat => generic labels
    toggleReadBtn.innerText = 'Mark as Read/Unread';
    muteBtn.innerText = 'Mute/Unmute';
  }

  // position menu near button
  const rect = buttonEl.getBoundingClientRect();
  globalMenu.style.position = 'absolute';
  globalMenu.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  globalMenu.style.left = (rect.left + window.scrollX - 10) + 'px';
  globalMenu.classList.remove('hidden');
}

// === Delegated click handling for message-list (handles static + dynamic) ===
messageList?.addEventListener("click", (e) => {
  const msgEl = e.target.closest(".message");
  if (!msgEl) return;

  // If dots button clicked
  const dots = e.target.closest(".dots-button");
  if (dots) {
    e.stopPropagation();
    const id = msgEl.getAttribute('data-id') || null;
    if (id) {
      openMenuForMessage(id, dots);
    } else {
      // static message (no saved chat id) - open menu for DOM element
      currentMenuTargetId = null; // indicate static
      openMenuForMessage(null, dots);
    }
    return;
  }

  // Otherwise, open chat (only for saved chats)
  const id = msgEl.getAttribute('data-id');
  if (id) {
    openChatWindowById(id);
  } else {
    // static messages: we can optionally open a quick chat view (not persistent)
    const name = msgEl.querySelector("strong")?.innerText || "User";
    openChatWindowByName(name, msgEl.querySelector('img')?.src || '');
  }
});

// === Menu action handlers ===
globalMenu.querySelector('.delete-chat').addEventListener('click', (e) => {
  e.stopPropagation();
  globalMenu.classList.add('hidden');
  const id = currentMenuTargetId;
  if (!id) {
    // static message: remove the DOM message
    const focused = document.activeElement;
    const msgEl = document.querySelector('.message:hover') || null;
    if (msgEl) msgEl.remove();
    return;
  }
  const idx = findChatIndexById(id);
  if (idx >= 0) {
    const removed = savedChats.splice(idx, 1)[0];
    // remove history
    if (removed && removed.name && chatHistory[removed.name]) {
      delete chatHistory[removed.name];
      saveHistoryToStorage();
    }
    saveChatsToStorage();
    // remove DOM
    const el = messageList.querySelector(`.message[data-id="${id}"]`);
    if (el) el.remove();
    // close chat window if open for this chat
    if (currentChatId === id) {
      chatWindow.classList.add('hidden');
      messageList.style.display = "block";
      fab.style.display = "block";
    }
  }
  currentMenuTargetId = null;
});

globalMenu.querySelector('.edit-chat').addEventListener('click', (e) => {
  e.stopPropagation();
  globalMenu.classList.add('hidden');
  const id = currentMenuTargetId;
  if (!id) return;
  const chat = findChatById(id);
  if (!chat) return;
  const newName = prompt("Edit chat name:", chat.name);
  if (!newName) return;
  const trimmed = newName.trim();
  if (!trimmed) return alert("Name cannot be empty.");
  if (savedChats.some(c => c.name === trimmed && c.id !== id)) return alert("Another chat with this name exists.");
  // update history key (move)
  if (chatHistory[chat.name]) {
    chatHistory[trimmed] = chatHistory[chat.name];
    delete chatHistory[chat.name];
    saveHistoryToStorage();
  }
  chat.name = trimmed;
  saveChatsToStorage();
  updateMessageElement(chat);
  // if this chat is currently open, update header
  if (currentChatId === id) {
    currentChatName = trimmed;
    chatNameEl.textContent = trimmed;
  }
  currentMenuTargetId = null;
});

globalMenu.querySelector('.toggle-read').addEventListener('click', (e) => {
  e.stopPropagation();
  globalMenu.classList.add('hidden');
  const id = currentMenuTargetId;
  if (!id) return;
  const chat = findChatById(id);
  if (!chat) return;
  chat.unread = !chat.unread;
  saveChatsToStorage();
  updateMessageElement(chat);
  // if marking read/unread while chat open, keep it consistent
  if (currentChatId === id && chat.unread) {
    // do nothing special
  }
  currentMenuTargetId = null;
});

globalMenu.querySelector('.mute-chat').addEventListener('click', (e) => {
  e.stopPropagation();
  globalMenu.classList.add('hidden');
  const id = currentMenuTargetId;
  if (!id) return;
  const chat = findChatById(id);
  if (!chat) return;
  chat.muted = !chat.muted;
  saveChatsToStorage();
  updateMessageElement(chat);
  currentMenuTargetId = null;
});

// === Open chat window by id ===
function openChatWindowById(id) {
  const chat = findChatById(id);
  if (!chat) return;
  currentChatId = id;
  currentChatName = chat.name;
  chatNameEl.textContent = chat.name;
  if (chat.avatar && chatAvatarEl) chatAvatarEl.src = chat.avatar;

  // clear unread on open
  if (chat.unread) {
    chat.unread = false;
    saveChatsToStorage();
    updateMessageElement(chat);
  }

  chatMessagesEl.innerHTML = "";
  const messages = chatHistory[chat.name] || [];
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

// fallback: open chat window by name for static items
function openChatWindowByName(name, avatar) {
  currentChatName = name;
  currentChatId = null;
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
      msg.style.display = '';
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
"Haha okay 😄","I'll check it and let you know.","Busy right now, talk later!",
  "Sounds good to me!","Can you send that again?","😂😂😂","Hmm, interesting...",
  "I agree!","No way, really?","Just saw it!","That’s crazy!","What do you mean?",
  "Let me think about it.","Haha good one!","I was just about to say that!",
  "Where are you now?","I’m on my way.","Let’s catch up later!","Exactly!",
  "You're right!","Wait what? 😳","I didn’t expect that!","Let me get back to you.",
  "Cool cool 😎","Just woke up 💤","I’m tired today 😩","Same here!",
  "Oh really? Tell me more.","Lol that’s wild 😂","I knew it!",
  "This is getting interesting 🤔","Brb","I’m in a meeting right now.",
  "I’ll call you in a bit.","Tell me everything!","Okay let’s do it!",
  "What happened next?","Omg 😱","That made me laugh hard 😂","Good luck!",
  "Hope you’re doing okay.","Let’s plan something soon!","Why not?",
  "Haha stop it 🤭","You always say that 😂","Nah, I don’t believe it!",
  "Send pic!","Wait, you’re serious?","Love it ❤️","Don’t be shy lol"
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
  normalizeSavedChats();
  // Render saved chats (they will appear at top)
  savedChats.forEach(chat => renderChatItem(chat));

  // Add dots buttons to existing static messages
  enhanceExistingMessages();
});

