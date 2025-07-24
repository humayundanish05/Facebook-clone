console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  /* ==================== LOGIN ==================== */
  const loginBtn = document.querySelector("button");

  if (loginBtn && loginBtn.textContent.includes("Log") || loginBtn.textContent.includes("Login")) {
    loginBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll("input");
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      if (email && password) {
        alert("Login successful!");
        window.location.href = "home.html";
      } else {
        alert("Please enter both email and password.");
      }
    });
  }

  /* ==================== STATIC POSTS ==================== */
  document.querySelectorAll(".post").forEach(post => {
    attachPostEvents(post);
  });

  /* ==================== STATUS POST ==================== */
  const postBtn = document.getElementById("post-btn");
  const photoBtn = document.getElementById("photo-btn");
  const statusInput = document.getElementById("status-text");
  const imageInput = document.getElementById("status-image");
  const feed = document.getElementById("post-feed");

  if (photoBtn && imageInput) {
    photoBtn.addEventListener("click", () => imageInput.click());
  }

  if (postBtn && statusInput && feed) {
    postBtn.addEventListener("click", () => {
      const text = statusInput.value.trim();
      const imageFile = imageInput.files[0];

      if (!text && !imageFile) return;

      const reader = new FileReader();
      reader.onload = function () {
        const imageSrc = imageFile ? `<img src="${reader.result}" class="post-image" />` : "";
        const newPost = document.createElement("div");
        newPost.classList.add("post");
        newPost.innerHTML = `
          <div class="post-header">
            <img src="user.jpg" class="avatar" />
            <div>
              <strong>humayun danish</strong><br/>
              <small>Just now • 🌍</small>
            </div>
          </div>
          <div class="post-content">
            <p>${text}</p>
            ${imageSrc}
          </div>
          <div class="post-counts">
            <span class="like-count">👍 0</span>
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
            <div class="comments"></div>
            <div class="comment-input">
              <input type="text" placeholder="Write a comment..." />
              <button class="add-comment">Post</button>
            </div>
          </div>
        `;
        feed.prepend(newPost);
        statusInput.value = "";
        imageInput.value = "";
        attachPostEvents(newPost);
      };

      if (imageFile) {
        reader.readAsDataURL(imageFile);
      } else {
        reader.onload(); // No image, run anyway
      }
    });
  }
});

/* ==================== EVENT HANDLER FUNCTION ==================== */
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
    }
  });
}

<script>
  document.querySelector('.top-btn.search').addEventListener('click', function () {
    const query = prompt("Search Google:");
    if (query) {
      const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.open(url, '_blank');
    }
  });
</script>
