document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("button");
  const inputs = document.querySelectorAll("input");
  const loader = document.getElementById("loader");

  loginBtn.addEventListener("click", () => {
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (email === "" || password === "") {
      alert("Please fill in both fields.");
      return;
    }

    loader.classList.remove("hidden");
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    setTimeout(() => {
      loader.classList.add("hidden");
      loginBtn.disabled = false;
      loginBtn.textContent = "Log In";
      alert("Login successful!");
      window.location.href = "home.html";
    }, 2000);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginBtn.click();
    }
  });
});

console.log("JS Loaded");

document.addEventListener("DOMContentLoaded", () => {
  const postBtn = document.getElementById("submitPost");
  const statusInput = document.getElementById("postText");
  const feed = document.getElementById("postFeed");

  // Load saved posts
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.forEach(post => renderPost(post));

  // Submit new post (text-only)
  postBtn.addEventListener("click", () => {
    const text = statusInput.value.trim();
    if (!text) return;

    const newPost = {
      id: Date.now(),
      text,
      time: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPost(newPost, true);
    statusInput.value = "";
  });

  // Render post
  function renderPost(postData, prepend = false) {
  // 🛡️ Default values if missing
  postData.likes = postData.likes || 0;
  postData.comments = postData.comments || [];

  const post = document.createElement("div");
  post.className = "post";
  post.setAttribute("data-id", postData.id);

  post.innerHTML = `
    <div class="post-header">
      <a href="profile.html"><img src="user.jpg" alt="Profile"></a>
      <div>
        <div class="name">Humayun Danish</div>
        <div class="time">${formatTime(postData.time)}</div>
      </div>
    </div>
    <div class="post-content">
      ${postData.text ? `<p>${postData.text}</p>` : ""}
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

  prepend ? feed.prepend(post) : feed.appendChild(post);
  }
  // Update localStorage
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

// greeting messages 
  const hour = new Date().getHours();
  let greeting = "";
  let message = "";

  if (hour >= 5 && hour < 9) {
    greeting = "Good early morning";
    message = "Hope you woke up refreshed ☕";
  } else if (hour >= 9 && hour < 12) {
    greeting = "Good morning";
    message = "Let’s make today awesome!";
  } else if (hour >= 12 && hour < 14) {
    greeting = "Good noon";
    message = "Perfect time for a little break 🍽️";
  } else if (hour >= 14 && hour < 17) {
    greeting = "Good afternoon";
    message = "Keep crushing your goals 🔥";
  } else if (hour >= 17 && hour < 20) {
    greeting = "Good evening";
    message = "Hope you had a productive day 💻";
  } else if (hour >= 20 && hour < 24) {
    greeting = "Good night";
    message = "Time to relax and unwind 🌙";
  } else {
    greeting = "Still up?";
    message = "Burning the midnight oil? 🕯️";
  }

  document.getElementById("greeting").innerHTML = `
    <div>
      <strong>${greeting}, Humayun!</strong><br />
      <small>${message}</small>
    </div>
  `;

