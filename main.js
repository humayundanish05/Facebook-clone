console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const photoBtn = document.querySelector(".custom-upload");
  const statusInput = document.getElementById("postText");
  const imageInput = document.getElementById("postImage");
  const feed = document.getElementById("postFeed");

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Load saved posts
  posts.forEach(post => {
    const postElement = createPostElement(post);
    feed.prepend(postElement);
    attachPostEvents(postElement);
  });

  // Attach events to static posts
  document.querySelectorAll(".post").forEach(post => {
    attachPostEvents(post);
  });

  // Upload image trigger
  if (photoBtn && imageInput) {
    photoBtn.addEventListener("click", () => imageInput.click());
  }

  // Create post
  if (postBtn && statusInput && feed) {
    postBtn.addEventListener("click", () => {
      const text = statusInput.value.trim();
      const imageFile = imageInput.files[0];

      if (!text && !imageFile) return;

      const newPost = {
        text,
        image: "",
        likes: 0,
        comments: [],
        timestamp: Date.now()
      };

      const renderAndSave = () => {
        const postElement = createPostElement(newPost);
        feed.prepend(postElement);
        attachPostEvents(postElement);

        posts.unshift(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        statusInput.value = "";
        imageInput.value = "";
      };

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          newPost.image = reader.result;
          renderAndSave();
        };
        reader.readAsDataURL(imageFile);
      } else {
        renderAndSave();
      }
    });
  }

  // Google search shortcut
  const searchBtn = document.querySelector(".top-btn.search");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const query = prompt("Search Google:");
      if (query) {
        const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
        window.open(url, "_blank");
      }
    });
  }
});

// Create post element from data
function createPostElement(postData) {
  const { text, image, likes = 0, comments = [], timestamp } = postData;

  const post = document.createElement("div");
  post.classList.add("post");

  post.innerHTML = `
    <div class="post-header">
      <a href="profile.html"><img src="user.jpg" class="avatar" /></a>
      <div>
        <strong>Humayun Danish</strong><br/>
        <small>${formatTime(timestamp)} • 🌍</small>
      </div>
    </div>
    <div class="post-content">
      <p>${text}</p>
      ${image ? `<img src="${image}" class="post-image" />` : ""}
    </div>
    <div class="post-counts">
      <span class="like-count">👍 ${likes}</span>
    </div>
    <div class="actions">
      <button class="like-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#65676b" viewBox="0 0 24 24">
          <path d="M9 22H5a2 2 0 01-2-2v-7a2 2 0 012-2h4v11zm2-11V5.41c0-.9.73-1.63 1.63-1.63.43 0 .85.17 1.16.48l.99.99c.36.36.83.59 1.34.63l2.61.21c1.05.08 1.87.97 1.87 2.02v.46a2.02 2.02 0 01-.56 1.4l-4.73 5.09A2 2 0 0114.1 16H11v-5z"/>
        </svg>
        <span>Like</span>
      </button>
      <button class="comment-toggle">💬 Comment</button>
      <button>↪️ Share</button>
    </div>
    <div class="comment-section hidden">
      <div class="comments">
        ${comments.map(comment => `<div class="comment">${comment}</div>`).join("")}
      </div>
      <div class="comment-input">
        <input type="text" placeholder="Write a comment..." />
        <button class="add-comment">Post</button>
      </div>
    </div>
  `;

  return post;
}

// Attach like and comment events
function attachPostEvents(post) {
  const likeBtn = post.querySelector(".like-btn");
  const likeCountEl = post.querySelector(".like-count");
  const commentToggle = post.querySelector(".comment-toggle");
  const commentSection = post.querySelector(".comment-section");
  const commentInput = post.querySelector(".comment-input input");
  const commentAddBtn = post.querySelector(".add-comment");
  const commentsDiv = post.querySelector(".comments");

  let liked = false;
  let baseCount = parseInt(likeCountEl?.textContent.match(/\d+/)?.[0] || "0");

  likeBtn?.addEventListener("click", () => {
    liked = !liked;
    likeBtn.classList.toggle("liked", liked);
    const newCount = liked ? baseCount + 1 : baseCount;
    likeCountEl.textContent = `👍 ${newCount}`;

    saveLikes(post, newCount);
  });

  commentToggle?.addEventListener("click", () => {
    commentSection.classList.toggle("hidden");
  });

  commentAddBtn?.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = text;
      commentsDiv.appendChild(div);
      commentInput.value = "";

      saveComment(post, text);
    }
  });
}

// Save likes to localStorage
function saveLikes(postElement, newLikes) {
  const time = getPostTime(postElement);
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.map(p => (p.timestamp === time ? { ...p, likes: newLikes } : p));
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Save comments to localStorage
function saveComment(postElement, commentText) {
  const time = getPostTime(postElement);
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts = posts.map(p => {
    if (p.timestamp === time) {
      return { ...p, comments: [...p.comments, commentText] };
    }
    return p;
  });
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Utility to get post time from DOM
function getPostTime(postElement) {
  const small = postElement.querySelector("small");
  const text = small?.textContent || "";
  const timeText = text.split("•")[0].trim();
  return new Date(timeText).getTime() || 0;
}

// Format timestamp into readable time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
