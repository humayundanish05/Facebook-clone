document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const photoBtn = document.querySelector(".custom-upload");
  const statusInput = document.getElementById("postText");
  const imageInput = document.getElementById("postImage");
  const feed = document.getElementById("postFeed");

  // Trigger file input on 📷 label click
  if (photoBtn && imageInput) {
    photoBtn.addEventListener("click", () => imageInput.click());
  }

  // Load saved posts
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.forEach(post => renderPost(post));

  // Post creation logic
  postBtn?.addEventListener("click", () => {
    const text = statusInput.value.trim();
    const file = imageInput.files[0];

    if (!text && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        createPost(text, imageData);
        resetInputs();
      };
      reader.readAsDataURL(file);
    } else {
      createPost(text, "");
      resetInputs();
    }
  });

  function resetInputs() {
    statusInput.value = "";
    imageInput.value = "";        // Reset value
    imageInput.type = "";         // Reset file input completely
    imageInput.type = "file";
  }

  function createPost(text, image) {
    const newPost = {
      id: Date.now(),
      text,
      image,
      time: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPost(newPost, true);
  }

  function renderPost(post, prepend = false) {
    const div = document.createElement("div");
    div.className = "post";
    div.setAttribute("data-id", post.id);

    div.innerHTML = `
      <div class="post-header">
        <img src="user.jpg" alt="Profile">
        <div>
          <div class="name">Humayun Danish</div>
          <div class="time">${formatTime(post.time)}</div>
        </div>
      </div>
      <div class="post-content">
        ${post.text ? `<p>${post.text}</p>` : ""}
        ${post.image ? `<img src="${post.image}" alt="Uploaded Image">` : ""}
      </div>
      <div class="like-count">${post.likes} likes</div>
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
          ${post.comments.map(c => `<p>${c}</p>`).join("")}
        </div>
      </div>
    `;

    // Event Listeners
    div.querySelector(".like-btn").addEventListener("click", () => {
      post.likes++;
      updatePost(post);
      div.querySelector(".like-count").textContent = `${post.likes} likes`;
    });

    div.querySelector(".comment-toggle").addEventListener("click", () => {
      div.querySelector(".comment-section").classList.toggle("hidden");
    });

    div.querySelector(".add-comment").addEventListener("click", () => {
      const input = div.querySelector(".comment-input input");
      const comment = input.value.trim();
      if (comment) {
        post.comments.push(comment);
        updatePost(post);
        div.querySelector(".comments").innerHTML += `<p>${comment}</p>`;
        input.value = "";
      }
    });

    if (prepend) {
      feed.prepend(div);
    } else {
      feed.appendChild(div);
    }
  }

  function updatePost(updated) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const index = posts.findIndex(p => p.id === updated.id);
    if (index !== -1) {
      posts[index] = updated;
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
});    </div>

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
