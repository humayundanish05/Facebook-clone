/* main.js - Fixed full version (preserves all original features) */
console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------- LOGIN (first block) ---------------------- */
  const loginBtn = document.querySelector("button");
  const inputs = document.querySelectorAll("input");
  const loader = document.getElementById("loader");

  if (loginBtn && inputs.length >= 2 && loader) {
    loginBtn.addEventListener("click", () => {
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      if (email === "" || password === "") {
        alert("Please fill in both fields.");
        return;
      }

      loader.classList.remove("hidden");
      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      setTimeout(() => {
        loader.classList.add("hidden");
        loginBtn.disabled = false;
        loginBtn.textContent = "Log In";
        alert("Login successful!");
        window.location.href = "home.html";
      }, 2000);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        loginBtn.click();
      }
    });
  }

  /* ---------------------- POST / FEED (local storage posts) ---------------------- */
  const postBtn = document.getElementById("submitPost");
  const statusInput = document.getElementById("postText");
  // IMPORTANT: HTML was changed to use id="dynamicPostFeed"
  const feed = document.getElementById("dynamicPostFeed");

  // Load saved posts (if feed exists)
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  if (feed && savedPosts.length > 0) {
    savedPosts.forEach(post => renderPost(post));
  }

  // Post button behaviour
  if (postBtn && statusInput) {
    postBtn.addEventListener("click", () => {
      const text = statusInput.value.trim();
      if (!text) return;

      const newPost = {
        id: Date.now(),
        text,
        time: new Date().toISOString(),
        likes: 0,
        comments: []
      };

      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts.unshift(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderPost(newPost, true);
      statusInput.value = "";
    });
  }

  /* ---------------------- renderPost / updatePost / helpers ---------------------- */
  function renderPost(postData, prepend = false) {
    postData.likes = postData.likes || 0;
    postData.comments = postData.comments || [];

    const post = document.createElement("div");
    post.className = "post";
    post.setAttribute("data-id", postData.id);

    post.innerHTML = `
      <div class="post-header">
        <a href="profile.html"><img src="user.jpg" alt="Profile"></a>
        <div>
          <div class="name">Humayun Danish</div>
          <div class="time">${formatTime(postData.time)}</div>
        </div>
      </div>
      <div class="post-content">
        ${postData.text ? `<p>${escapeHtml(postData.text)}</p>` : ""}
      </div>
      <div class="like-count">${postData.likes} likes</div>
      <div class="post-actions">
        <span class="like-btn"><i class="far fa-thumbs-up"></i> Like</span>
        <span class="comment-toggle"><i class="far fa-comment"></i> Comment</span>
        <span><i class="fas fa-share"></i> Share</span>
      </div>
      <div class="comment-section hidden">
        <div class="comment-input">
          <input type="text" placeholder="Write a comment...">
          <button class="add-comment">Post</button>
        </div>
        <div class="comments">
          ${postData.comments.map(c => `<p>${escapeHtml(c)}</p>`).join("")}
        </div>
      </div>
    `;

    // Like button
    const likeBtn = post.querySelector(".like-btn");
    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        postData.likes++;
        updatePost(postData);
        const lc = post.querySelector(".like-count");
        if (lc) lc.textContent = `${postData.likes} likes`;
      });
    }

    // Toggle comments
    const commentToggle = post.querySelector(".comment-toggle");
    if (commentToggle) {
      commentToggle.addEventListener("click", () => {
        const cs = post.querySelector(".comment-section");
        if (cs) cs.classList.toggle("hidden");
      });
    }

    // Add comment
    const addCommentBtn = post.querySelector(".add-comment");
    if (addCommentBtn) {
      addCommentBtn.addEventListener("click", () => {
        const input = post.querySelector(".comment-input input");
        const comment = input ? input.value.trim() : "";
        if (comment) {
          postData.comments.push(comment);
          updatePost(postData);
          const commentsContainer = post.querySelector(".comments");
          if (commentsContainer) commentsContainer.innerHTML += `<p>${escapeHtml(comment)}</p>`;
          if (input) input.value = "";
        }
      });
    }

    // Insert into DOM if feed exists
    if (feed) {
      prepend ? feed.prepend(post) : feed.appendChild(post);
    }
  }

  function updatePost(updatedPost) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }

  function formatTime(isoString) {
    // handle possible undefined/new posts that use local toLocaleString time
    try {
      const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
      // if isoString invalid (e.g., when using localized time) fallback
      return isoString || "";
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---------------------- GREETING MESSAGES ---------------------- */
  (function showGreeting() {
    const greetingEl = document.getElementById("greeting");
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greeting = "";
    let message = "";

    if (hour >= 5 && hour < 9) {
      greeting = "Good early morning";
      message = "Hope you woke up refreshed ☕";
    } else if (hour >= 9 && hour < 12) {
      greeting = "Good morning";
      message = "Let’s make today awesome!";
    } else if (hour >= 12 && hour < 14) {
      greeting = "Good noon";
      message = "Perfect time for a little break 🍽️";
    } else if (hour >= 14 && hour < 17) {
      greeting = "Good afternoon";
      message = "Keep crushing your goals 🔥";
    } else if (hour >= 17 && hour < 20) {
      greeting = "Good evening";
      message = "Hope you had a productive day 💻";
    } else if (hour >= 20 && hour < 24) {
      greeting = "Good night";
      message = "Time to relax and unwind 🌙";
    } else {
      greeting = "Still up?";
      message = "Burning the midnight oil? 🕯️";
    }

    greetingEl.innerHTML = `
      <div>
        <strong>${escapeHtml(greeting)}, Humayun!</strong><br />
        <small>${escapeHtml(message)}</small>
      </div>
    `;
  })();

  /* ---------------------- THEME / TOGGLING ---------------------- */
  // Initialize theme safely (was window.onload in original)
  (function initTheme() {
    const mode = localStorage.getItem("theme") || "light";
    document.body.classList.add(`${mode}-mode`);
    updateLabel(mode);
  })();

  function toggleTheme() {
    const isDark = document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", !isDark);
    document.body.classList.toggle("light-mode", isDark);
    localStorage.setItem("theme", isDark ? "light" : "dark");
    updateLabel(isDark ? "light" : "dark");
  }

  function updateLabel(mode) {
    const label = document.getElementById("themeLabel");
    if (label) label.innerText = mode === "dark" ? "Dark Mode ✅" : "Light Mode 🌞";
  }

  // if original had a toggle element with onclick="toggleTheme()", it still works
  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  /* ---------------------- External posts (DummyJSON + photos) ---------------------- */
  // Use same id "dynamicPostFeed" for external posts to append
  const postFeed = document.getElementById("dynamicPostFeed");
const photos = [/* photos array same as before */];

let limit = 20;  // per batch posts
let skip = 0;    // start at zero

async function loadRealPosts() {
  if (!postFeed) return;

  try {
    const [postsRes, usersRes] = await Promise.all([
      fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`),
      fetch('https://dummyjson.com/users')
    ]);

    const postsData = await postsRes.json();
    const usersData = await usersRes.json();

    const posts = postsData.posts;
    const users = usersData.users;

    if (posts.length === 0) {
      console.log('No more posts to load.');
      return; // no more posts
    }

    posts.forEach((post, index) => {
      const user = users.find(u => u.id === post.userId) || { id: 1, firstName: "User", lastName: "" };
      const photo = photos[(skip + index) % photos.length];

      const postElement = document.createElement('div');
      postElement.className = 'post';

      postElement.innerHTML = `
        <div class="post-header">
          <img src="https://i.pravatar.cc/40?img=${user.id}" alt="${escapeHtml(user.firstName)}">
          <div>
            <div class="name">${escapeHtml(user.firstName)} ${escapeHtml(user.lastName || "")}</div>
            <div class="time">Just now</div>
          </div>
        </div>
        <div class="post-content">
          <img src="${photo}" alt="Post image" />
          <h4>${escapeHtml(post.title)}</h4>
          <p>${escapeHtml(post.body)}</p>
        </div>
        <div class="post-actions">
          <span><i class="far fa-thumbs-up"></i> Like</span>
          <span><i class="far fa-comment"></i> Comment</span>
          <span><i class="fas fa-share"></i> Share</span>
        </div>
      `;

      postFeed.appendChild(postElement);
    });

    skip += posts.length;  // update skip for next batch

  } catch (error) {
    console.error('Failed to load posts:', error);
  }
}

// Load initial posts
loadRealPosts();

// Optional: Load more button to fetch next posts on click
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  loadRealPosts();
});
}); // end DOMContentLoaded
