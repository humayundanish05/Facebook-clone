console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const photoBtn = document.querySelector(".custom-upload");
  const statusInput = document.getElementById("postText");
  const imageInput = document.getElementById("postImage");
  const feed = document.getElementById("postFeed");

  // Load posts from localStorage
  const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  storedPosts.forEach(post => {
    const postEl = createPostElement(post);
    feed.appendChild(postEl);
  });

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
        const imageSrc = imageFile ? reader.result : "";
        const newPostData = {
          id: Date.now(),
          text,
          image: imageSrc,
          likes: 0,
          comments: []
        };

        // Save to localStorage
        storedPosts.unshift(newPostData);
        localStorage.setItem("posts", JSON.stringify(storedPosts));

        const postEl = createPostElement(newPostData);
        feed.prepend(postEl);
        statusInput.value = "";
        imageInput.value = "";
      };

      if (imageFile) reader.readAsDataURL(imageFile);
      else reader.onload();
    });
  }
});
function createPostElement(postData) {
  const post = document.createElement("div");
  post.classList.add("post");

  post.innerHTML = `
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
      <button class="like-btn"><span>👍 Like</span></button>
      <button class="comment-toggle">💬 Comment</button>
      <button>↪️ Share</button>
    </div>
    <div class="comment-section hidden">
      <div class="comments">
        ${postData.comments.map(c => `<div class="comment">${c}</div>`).join("")}
      </div>
      <div class="comment-input">
        <input type="text" placeholder="Write a comment..." />
        <button class="add-comment">Post</button>
      </div>
    </div>
  `;

  attachPostEvents(post, postData.id);
  return post;
}

function attachPostEvents(post, postId) {
  const likeBtn = post.querySelector(".like-btn");
  const likeCountEl = post.querySelector(".like-count");
  const commentToggle = post.querySelector(".comment-toggle");
  const commentInput = post.querySelector(".comment-input input");
  const commentAddBtn = post.querySelector(".add-comment");
  const commentsDiv = post.querySelector(".comments");

  likeBtn?.addEventListener("click", () => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      posts[postIndex].likes++;
      localStorage.setItem("posts", JSON.stringify(posts));
      likeCountEl.textContent = `👍 ${posts[postIndex].likes}`;
    }
  });

  commentToggle?.addEventListener("click", () => {
    post.querySelector(".comment-section").classList.toggle("hidden");
  });

  commentAddBtn?.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text) return;

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      posts[postIndex].comments.push(text);
      localStorage.setItem("posts", JSON.stringify(posts));
    }

    const div = document.createElement("div");
    div.className = "comment";
    div.textContent = text;
    commentsDiv.appendChild(div);
    commentInput.value = "";
  });
}
