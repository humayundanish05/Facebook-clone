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

  // Load saved posts
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.forEach(post => renderPost(post));

  postBtn.addEventListener("click", () => {
    const text = statusInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!text && !imageFile) return;

    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png",
      "image/webp", "image/gif", "image/bmp",
      "image/svg+xml"
    ];
    const maxSizeMB = 10;

    const createPost = (imageData = "") => {
      const newPost = {
        id: Date.now(),
        text,
        image: imageData,
        time: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      const posts = JSON.parse(localStorage.getItem("posts")) || [];
      posts.unshift(newPost);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderPost(newPost, true);
    };

    if (imageFile) {
      if (!allowedTypes.includes(imageFile.type)) {
        alert("Only JPG, PNG, WebP, SVG, or GIF images are allowed.");
        return;
      }
      if (imageFile.size > maxSizeMB * 2048  * 2048) {
        alert("Image too large. Max allowed size is 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => createPost(reader.result);
      reader.readAsDataURL(imageFile);
    } else {
      createPost();
    }

    statusInput.value = "";
    imageInput.value = "";
  });

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

    post.querySelector(".like-btn").addEventListener("click", () => {
      postData.likes++;
      updatePost(postData);
      post.querySelector(".like-count").textContent = `${postData.likes} likes`;
    });

    post.querySelector(".comment-toggle").addEventListener("click", () => {
      post.querySelector(".comment-section").classList.toggle("hidden");
    });

    post.querySelector(".add-comment").addEventListener("click", () => {
      const input = post.querySelector(".comment-input input");
      const comment = input.value.trim();
      if (comment) {
        postData.comments.push(comment);
        updatePost(postData);
        post.querySelector(".comments").innerHTML += `<p>${comment}</p>`;
        input.value = "";
      }
    });

    if (prepend) {
      feed.prepend(post);
    } else {
      feed.appendChild(post);
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
    const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString();
  }
});
