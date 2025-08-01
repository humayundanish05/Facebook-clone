let currentChatName = "User";

// === New Chat Creation + Local Storage Integration ===
const fab = document.querySelector(".fab");
const modal = document.getElementById("newChatModal");
const createBtn = document.getElementById("createChatBtn");
const cancelBtn = document.getElementById("cancelChatBtn");
const nameInput = document.getElementById("newChatName");
//pick random avatar for new generated chats 
const randomAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
//---------

let savedChats = JSON.parse(localStorage.getItem("chats")) || [];


fab.addEventListener("click", () => {
  modal.classList.remove("hidden");
  nameInput.value = "";
  nameInput.focus();
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

createBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) return alert("Please enter a name.");

  if (savedChats.some(c => c.name === name)) {
    return alert("Chat with this name already exists.");
  }

  const avatar = avatarURLs[Math.floor(Math.random() * avatarURLs.length)];
  const newChat = { name, avatar };
  savedChats.push(newChat);
  localStorage.setItem("chats", JSON.stringify(savedChats));

  renderChatItem(newChat);
  modal.classList.add("hidden");
});

function renderChatItem({ name, avatar }) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `
    <img src="${avatar}" />
    <div>
      <strong>${name}</strong><br/>
      <span>Start your conversation</span>
    </div>
  `;
  msg.addEventListener("click", () => openChatWindow(name, avatar));
  document.querySelector(".message-list").prepend(msg);
}

// === Load chats on page load ===
window.addEventListener("DOMContentLoaded", () => {
  savedChats.forEach(chat => renderChatItem(chat));
});

// === Function to open chat and load its messages ===
function openChatWindow(name, avatar) {
  currentChatName = name;
  document.getElementById("chat-name").textContent = name;
  document.querySelector(".chat-avatar").src = avatar;

  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("chatHistory")) || {};
  const messages = history[name] || [];

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.type}`;
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;

  document.querySelector(".chat-window").classList.remove("hidden");
  document.querySelector(".message-list").style.display = "none";
  fab.style.display = "none";
  document.querySelector(".nav-row")?.classList.add("hidden");
  document.querySelector(".info-row")?.classList.add("hidden");
  document.querySelector(".bottom-bar")?.classList.add("hidden");
}

  
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

// === Open chat window on message click === 

document.querySelectorAll(".message").forEach(msg => {
  msg.addEventListener("click", () => {
    const chatWindow = document.querySelector(".chat-window");
    const name = msg.querySelector("strong").textContent;
    const imgSrc = msg.querySelector("img").getAttribute("src");

    currentChatName = name;

    document.getElementById("chat-name").textContent = name;
    chatWindow.querySelector(".chat-avatar").src = imgSrc;


    messages.innerHTML = "";

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

function sendMessage() { 
  const text = input.value.trim(); 
  if (text === "") return;

  const message = document.createElement("div"); 
  message.className = "message outgoing"; 
  message.textContent = text; 
  messages.appendChild(message);

  input.value = ""; 
  messages.scrollTop = messages.scrollHeight;

  setTimeout(sendFakeReply, 1500); // fake reply delay 
}

sendBtn.addEventListener("click", sendMessage); 
input.addEventListener("keydown", (e) => { 
  if (e.key === "Enter" && !e.shiftKey) { 
    e.preventDefault(); 
    sendMessage(); 
  } 
});

// === Image sending === 
document.getElementById("imageInput").addEventListener("change", function () { 
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

// === Like button === 
document.querySelector(".like-btn").addEventListener("click", () => { 
  const like = document.createElement("div"); 
  like.className = "message outgoing"; 
  like.textContent = "👍"; 
  messages.appendChild(like); 
  messages.scrollTop = messages.scrollHeight; 
});

// === Scroll on input focus (mobile fix) === 
const inputField = document.getElementById("messageInput"); 
inputField.addEventListener("focus", () => { 
  setTimeout(() => { 
    messages.scrollTop = messages.scrollHeight; 
  }, 300); 
});

// === Fake reply texts === 
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

// === Generate a fake incoming reply === 
function sendFakeReply() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.textContent = `${currentChatName} is typing...`;  // 🔥 Dynamic name
  messages.appendChild(typingDiv);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();

    const reply = fakeReplies[Math.floor(Math.random() * fakeReplies.length)];
    const replyDiv = document.createElement("div");
    replyDiv.className = "message incoming";
    replyDiv.textContent = reply;

    messages.appendChild(replyDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 1500);
}




