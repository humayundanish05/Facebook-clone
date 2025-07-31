
console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const photoBtn = document.querySelector(".custom-upload");
  const statusInput = document.getElementById("postText");
  const imageInput = document.getElementById("postImage");
  const feed = document.getElementById("postFeed");

  if (photoBtn && imageInput) {
    photoBtn.addEventListener("click", () => imageInput.click());
  }

  loadSavedPosts();

  postBtn?.addEventListener("click", () => {
    const text = statusInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!text && !imageFile) return;

    const reader = new FileReader();
    reader.onload = function () {
      const imageSrc = imageFile ? reader.result : "";
      const postData = {
        id: Date.now(),
        text,
        image: imageSrc,
        likes: 0,
        comments: []
       timestamp: Date.now() 
      };
      savePostToLocal(postData);

      const postElement = createPostElement(postData);
      feed.prepend(postElement);
      attachPostEvents(postElement, postData);

      statusInput.value = "";
      imageInput.value = "";
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    } else {
      reader.onload();
    }
  });

  // Google Search Shortcut (optional)
  document.querySelector('.top-btn.search')?.addEventListener('click', function () {
    const query = prompt("Search Google:");
    if (query) {
      const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.open(url, '_blank');
    }
  });
});

function loadSavedPosts() {
const postBtn = document.getElementById("submitPost");
const photoBtn = document.querySelector(".custom-upload");
const statusInput = document.getElementById("postText");
const imageInput = document.getElementById("postImage");
const feed = document.getElementById("postFeed");

// Load posts on page load
window.addEventListener("load", () => {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.forEach(post => renderPost(post));
});

// Create new post
postBtn.addEventListener("click", () => {
  const text = statusInput.value.trim();
  const image = imageInput.files[0];

  if (!text && !image) return;

  if (image) {
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      saveAndRenderPost(text, imageUrl);
    };
    reader.readAsDataURL(image);
  } else {
    saveAndRenderPost(text, null);
  }

  statusInput.value = "";
  imageInput.value = "";
});

function saveAndRenderPost(text, imageUrl) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const newPost = {
    id: Date.now(),
    text,
    image: imageUrl,
    time: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  posts.unshift(newPost);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPost(newPost, true);
}

function renderPost(postData, prepend = false) {
  const post = document.createElement("div");
  post.className = "post";
  post.setAttribute("data-id", postData.id);

  post.innerHTML = `
    <div class="post-header">
      <a href="profile.html">
        <img src="user.jpg" alt="Profile">
      </a>
      <div>
        <div class="name">Humayun Danish</div>
        <div class="time">${formatTime(postData.time)}</div>
      </div>
    </div>

    <div class="post-content">
      ${postData.text ? `<p>${postData.text}</p>` : ""}
      ${postData.image ? `<img src="${postData.image}" alt="Uploaded Image">` : ""}
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

  // Like button
  const likeBtn = post.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    postData.likes++;
    updatePost(postData);
    post.querySelector(".like-count").textContent = `${postData.likes} likes`;
  });

  // Comment toggle
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

// Update post in localStorage
function updatePost(updatedPost) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const index = posts.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = updatedPost;
    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

// Format time to "Just now", "2m ago", etc.
function formatTime(isoString) {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(isoString).toLocaleDateString();
}
