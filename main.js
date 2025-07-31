document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const imageInput = document.getElementById("postImage");
  const statusInput = document.getElementById("postText");
  const feed = document.getElementById("postFeed");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSizeMB = 2;

  loadSavedPosts();

  postBtn.addEventListener("click", () => {
    const text = statusInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!text && !imageFile) return;

    if (imageFile) {
      if (!allowedTypes.includes(imageFile.type)) {
        alert("Only JPG, PNG, WebP, or GIF images are allowed.");
        return;
      }
      if (imageFile.size > maxSizeMB * 1024 * 1024) {
        alert("Image too large. Max allowed size is 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        saveAndRenderPost(text, imageUrl);
        statusInput.value = "";
        imageInput.value = "";
      };
      reader.readAsDataURL(imageFile);
    } else {
      saveAndRenderPost(text, null);
      statusInput.value = "";
    }
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

  function loadSavedPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(post => renderPost(post));
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

    // Like handler
    post.querySelector(".like-btn").addEventListener("click", () => {
      postData.likes++;
      updatePost(postData);
      post.querySelector(".like-count").textContent = `${postData.likes} likes`;
    });

    // Toggle comment section
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

  function formatTime(iso) {
    const seconds = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(iso).toLocaleDateString();
  }
});    // Toggle comment section
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

  // Update post in localStorage
  function updatePost(updatedPost) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }

  // Format time
  function formatTime(isoString) {
    const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return new Date(isoString).toLocaleDateString();
  }
});
