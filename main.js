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

  // Load all saved posts from localStorage on page load
  loadSavedPosts();

  if (postBtn && statusInput && feed) {
    postBtn.addEventListener("click", () => {
      const text = statusInput.value.trim();
      const imageFile = imageInput.files[0];

      if (!text && !imageFile) return;

      const reader = new FileReader();
      reader.onload = function () {
        const imageSrc = imageFile ? reader.result : "";
        const postData = { text, image: imageSrc };
        savePostToLocal(postData);

        const postElement = createPostElement(postData.text, postData.image);
        feed.prepend(postElement);
        attachPostEvents(postElement);

        statusInput.value = "";
        imageInput.value = "";
      };

      if (imageFile) {
        reader.readAsDataURL(imageFile);
      } else {
        reader.onload(); // call manually if no image
      }
    });
  }

  // Google search shortcut
  document.querySelector('.top-btn.search')?.addEventListener('click', function () {
    const query = prompt("Search Google:");
    if (query) {
      const url = "https://www.google.com/search?q=" + encodeURIComponent(query);
      window.open(url, '_blank');
    }
  });
});

/* ========== Load posts from localStorage ========== */
function loadSavedPosts() {
  const feed = document.getElementById("postFeed");
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.reverse().forEach(post => {
    const postElement = createPostElement(post.text, post.image);
    feed.prepend(postElement);
    attachPostEvents(postElement);
  });
}

/* ========== Save post to localStorage ========== */
function savePostToLocal(postData) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push(postData);
  localStorage.setItem("posts", JSON.stringify(posts));
}

/* ========== Create a single post DOM element ========== */
function createPostElement(text, imageSrc) {
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
      ${imageSrc ? `<img src="${imageSrc}" class="post-image" />` : ""}
    </div>
    <div class="post-counts">
      <span class="like-count">👍 0</span>
    </div>
    <div class="actions">
      <button class="like-btn">👍 Like</button>
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
  return newPost;
}

/* ========== Like / Comment Event Binding ========== */
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
