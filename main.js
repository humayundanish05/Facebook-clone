
console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {

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
    try {
      const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
      if (seconds < 60) return "Just now";
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
      return new Date(isoString).toLocaleDateString();
    } catch (e) {
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

  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

  /* ---------------------- External posts (DummyJSON + photos) ---------------------- */
  const postFeed = document.getElementById("dynamicPostFeed");

  const photos = [
    'https://picsum.photos/600/400?random=1',
    'https://picsum.photos/600/400?random=2',
    'https://picsum.photos/600/400?random=3',
    'https://picsum.photos/600/400?random=4',
    'https://picsum.photos/600/400?random=5',
    'https://picsum.photos/600/400?random=6',
    'https://picsum.photos/600/400?random=7',
    'https://picsum.photos/600/400?random=8',
    'https://picsum.photos/600/400?random=9',
    'https://picsum.photos/600/400?random=10',
  ];

  let repeatCount = 0;
  let isLoading = false;

  async function loadRealPosts() {
    if (!postFeed || isLoading) return;
    isLoading = true;

    try {
      const [postsRes, usersRes] = await Promise.all([
        fetch('https://dummyjson.com/posts?limit=150'),
        fetch('https://dummyjson.com/users')
      ]);

      const postsData = await postsRes.json();
      const usersData = await usersRes.json();

      const posts = postsData.posts;
      const users = usersData.users;

      posts.forEach((post, index) => {
        const user = users.find(u => u.id === post.userId) || { id: 1, firstName: "User", lastName: "" };
        const photo = photos[(index + repeatCount * posts.length) % photos.length];

        const postElement = document.createElement('div');
        postElement.className = 'post';

        postElement.innerHTML = `
          <div class="post-header">
            <img src="https://i.pravatar.cc/40?img=${user.id}" alt="${escapeHtml(user.firstName)}">
            <div>
              <div class="name">${escapeHtml(user.firstName)} ${escapeHtml(user.lastName || "")}</div>
              <div class="time">Just now (Cycle ${repeatCount + 1})</div>
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

      repeatCount++;
    } catch (error) {
      console.error('Failed to load posts:', error);
    }

    isLoading = false;
  }

  loadRealPosts();

  window.addEventListener('scroll', () => {
    if (isLoading) return;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      loadRealPosts();
    }
  });

  function escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

}); // end DOMContentLoaded
