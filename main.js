console.log("JS Loaded");
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector("button");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll("input");
      const email = inputs[0].value.trim();
      const password = inputs[1].value.trim();

      if (email && password) {
        // Simulate successful login
        alert("Login successful!");
        window.location.href = "home.html";
      } else {
        alert("Please enter both email and password.");
      }
    });
  } else {
    alert("Login button not found.");
  }
});

/* post actions */
document.querySelectorAll(".post").forEach(post => {
  const likeBtn = post.querySelector(".like-btn");
  const likeCountEl = post.querySelector(".like-count");
  const commentToggle = post.querySelector(".comment-toggle");
  const commentSection = post.querySelector(".comment-section");
  const commentInput = post.querySelector(".comment-input input");
  const commentAddBtn = post.querySelector(".add-comment");
  const commentsDiv = post.querySelector(".comments");

  let liked = false;
  let baseCount = parseInt(likeCountEl.textContent.match(/\d+/)[0]);

  likeBtn.addEventListener("click", () => {
    liked = !liked;
    likeBtn.classList.toggle("liked", liked);
    const newCount = liked ? baseCount + 1 : baseCount;
    likeCountEl.textContent = `👍 ${newCount}`;
  });

  commentToggle.addEventListener("click", () => {
    commentSection.classList.toggle("hidden");
  });

  commentAddBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (text) {
      const div = document.createElement("div");
      div.className = "comment";
      div.textContent = text;
      commentsDiv.appendChild(div);
      commentInput.value = "";
    }
  });
});
