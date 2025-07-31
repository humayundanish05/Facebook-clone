
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
  const feed = document.getElementById("postFeed");
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.reverse().forEach(postData => {
    const postElement = createPostElement(postData);
    feed.prepend(postElement);
    attachPostEvents(postElement, postData);
  });
}

function savePostToLocal(postData) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push(postData);
  localStorage.setItem("posts", JSON.stringify(posts));
}

function updateLocalStoragePost(updatedPost) {
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  const index = posts.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = updatedPost;
    localStorage.setItem("posts", JSON.stringify(posts));
  }
}

function createPostElement(postData) {
  const newPost = document.createElement("div");
  newPost.classList.add("post");
  newPost.dataset.postId = postData.id;
  newPost.innerHTML = `
    <div class="post-header">
      <a href="profile.html"><img src="user.jpg" class="avatar" /></a>
      <div>
        <strong>Humayun Danish</strong><br/>
        <small>Just now • 🌍</small>
      </div>
    </div>
    <div class="post-content">
      <p>${postData.text}</p>
      ${postData.image ? `<img src="${postData.image}" class="post-image" />` : ""}
    </div>
    <div class="post-counts">
      <span class="like-count">👍 ${postData.likes}</span>
    </div>
    <div class="actions">
      <button class="like-btn">👍 Like</button>
      <button class="comment-toggle">💬 Comment</button>
      <button>↪️ Share</button>
    </div>
    <div class="comment-section hidden">
      <div class="comments">
        ${postData.comments.map(comment => `<div class="comment">${comment}</div>`).join("")}
      </div>
      <div class="comment-input">
        <input type="text" placeholder="Write a comment..." />
        <button class="add-comment">Post</button>
      </div>
    </div>
  `;
  return newPost;
}

function attachPostEvents(postElement, postData) {
  const likeBtn = postElement.querySelector(".like-btn");
  const likeCountEl = postElement.querySelector(".like-count");
  const commentToggle = postElement.querySelector(".comment-toggle");
  const commentSection = postElement.querySelector(".comment-section");
  const commentInput = postElement.querySelector(".comment-input input");
  const commentAddBtn = postElement.querySelector(".add-comment");
  const commentsDiv = postElement.querySelector(".comments");

  likeBtn?.addEventListener("click", () => {
    postData.likes += 1;
    likeCountEl.textContent = `👍 ${postData.likes}`;
    updateLocalStoragePost(postData);
  });

  commentToggle?.addEventListener("click", () => {
    commentSection.classList.toggle("hidden");
  });

  commentAddBtn?.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      postData.comments.push(text);
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = text;
      commentsDiv.appendChild(div);
      commentInput.value = "";
      updateLocalStoragePost(postData);
    }
  });
}
