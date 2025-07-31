console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const photoBtn = document.querySelector(".custom-upload");
  const statusInput = document.getElementById("postText");
  const imageInput = document.getElementById("postImage");
  const feed = document.getElementById("postFeed");

  // Trigger image input from custom button
  if (photoBtn && imageInput) {
    photoBtn.addEventListener("click", () => imageInput.click());
  }

  // Load posts on startup
  loadSavedPosts();

  // Create new post
  postBtn?.addEventListener("click", () => {
  const text = statusInput.value.trim();
  const imageFile = imageInput.files[0];

  if (!text && !imageFile) return;

  if (imageFile) {
    const reader = new FileReader();

    reader.onload = () => {
      const imageSrc = reader.result;
      createAndSavePost(text, imageSrc);
      resetInputs();
    };

    reader.readAsDataURL(imageFile);
  } else {
    createAndSavePost(text, "");
    resetInputs();
  }
});

function resetInputs() {
  statusInput.value = "";
  imageInput.value = "";
  // Trick to fully reset file input
  imageInput.type = "";
  imageInput.type = "file";
}
// Load saved posts from localStorage
function loadSavedPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach(post => renderPost(post));
}

// Save post to localStorage
function createAndSavePost(text, imageSrc) {
  const newPost = {
    id: Date.now(),
    text,
    image: imageSrc,
    time: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  savePost(newPost);
  renderPost(newPost, true);
}
// Update existing post (likes/comments)
function updatePost(updatedPost) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const index = posts.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = updatedPost;
    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

// Render a single post
function renderPost(postData, prepend = false) {
  const feed = document.getElementById("postFeed");
  const post = document.createElement("div");
  post.className = "post";
  post.setAttribute("data-id", postData.id);

  post.innerHTML = `
    <div class="post-header">
      <a href="profile.html">
        <img src="user.jpg" alt="Profile" class="avatar">
      </a>
      <div>
        <div class="name">Humayun Danish</div>
        <small>${formatTime(postData.time)} • 🌍</small>
      </div>
    </div>

    <div class="post-content">
      ${postData.text ? `<p>${postData.text}</p>` : ""}
      ${postData.image ? `<img src="${postData.image}" alt="Post Image">` : ""}
    </div>

    <div class="like-count">${postData.likes} likes</div>

    <div class="post-actions">
      <span class="like-btn">👍 Like</span>
      <span class="comment-toggle">💬 Comment</span>
      <span>↪️ Share</span>
    </div>

    <div class="comment-section hidden">
      <div class="comment-input">
        <input type="text" placeholder="Write a comment...">
        <button class="add-comment">Post</button>
      </div>
      <div class="comments">
        ${postData.comments.map(c => `<p>${c}</p>`).join("")}
      </div>
    </div>
  `;

  // Like
  post.querySelector(".like-btn").addEventListener("click", () => {
    postData.likes++;
    updatePost(postData);
    post.querySelector(".like-count").textContent = `${postData.likes} likes`;
  });

  // Toggle comment
  post.querySelector(".comment-toggle").addEventListener("click", () => {
    post.querySelector(".comment-section").classList.toggle("hidden");
  });

  // Add comment
  post.querySelector(".add-comment").addEventListener("click", () => {
    const input = post.querySelector(".comment-input input");
    const comment = input.value.trim();
    if (comment) {
      postData.comments.push(comment);
      updatePost(postData);
      const commentBox = post.querySelector(".comments");
      commentBox.innerHTML += `<p>${comment}</p>`;
      input.value = "";
    }
  });

  if (prepend) {
    feed.prepend(post);
  } else {
    feed.appendChild(post);
  }
}

// Time formatting
function formatTime(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(isoString).toLocaleDateString();
}
