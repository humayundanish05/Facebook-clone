console.log("JS Loaded");

// ==================== UTILITY FUNCTIONS ====================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - Escaped HTML text
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formats ISO timestamp to readable format
 * @param {string} isoTime - ISO formatted time string
 * @returns {string} - Formatted time string
 */
function formatTime(isoTime) {
  try {
    const date = new Date(isoTime);
    if (isNaN(date.getTime())) return 'Just now';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Unknown time';
  }
}

/**
 * Safely retrieves data from localStorage
 * @param {string} key - The storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} - Retrieved or default value
 */
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving from storage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Safely saves data to localStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store
 * @returns {boolean} - Success status
 */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
}

// ==================== DOM ELEMENTS ====================

const postBtn = document.getElementById("submitPost");
const statusInput = document.getElementById("postText");
const feed = document.getElementById("dynamicPostFeed");

// ==================== INITIALIZATION ====================

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeFeedFeature();
  } catch (error) {
    console.error('Error initializing feed feature:', error);
  }
});

// ==================== POST/FEED FUNCTIONALITY ====================

function initializeFeedFeature() {
  // Load saved posts (if feed exists)
  if (!feed) {
    console.warn('Feed container not found. Post feature disabled.');
    return;
  }

  const savedPosts = getFromStorage("posts", []);
  if (savedPosts.length > 0) {
    savedPosts.forEach(post => renderPost(post));
  }

  // Post button behaviour
  if (postBtn && statusInput) {
    postBtn.addEventListener("click", handlePostSubmit);
    statusInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handlePostSubmit();
      }
    });
  }
}

function handlePostSubmit() {
  const text = statusInput.value.trim();
  if (!text) {
    alert("Please write something before posting!");
    return;
  }

  const newPost = {
    id: Date.now(),
    text,
    time: new Date().toISOString(),
    likes: 0,
    comments: []
  };

  const posts = getFromStorage("posts", []);
  posts.unshift(newPost);
  
  if (saveToStorage("posts", posts)) {
    renderPost(newPost, true);
    statusInput.value = "";
    statusInput.focus();
  } else {
    alert("Error saving post. Please try again.");
  }
}

/**
 * Renders a single post to the feed
 * @param {Object} postData - Post data object
 * @param {boolean} prepend - Whether to add to top of feed
 */
function renderPost(postData, prepend = false) {
  if (!feed) return;
  
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
      ${postData.text ? `<p>${escapeHtml(postData.text)}</p>` : ""}
    </div>
    <div class="like-count">${postData.likes} likes</div>
    <div class="post-actions">
      <span class="like-btn"><i class="far fa-thumbs-up"></i> Like</span>
      <span class="comment-toggle"><i class="far fa-comment"></i> Comment</span>
      <span><i class="fas fa-share"></i> Share</span>
    </div>
    <div class="comment-section hidden">
      <div class="comment-input">
        <input type="text" placeholder="Write a comment...">
        <button class="add-comment">Post</button>
      </div>
      <div class="comments">
        ${postData.comments.map(c => `<p>${escapeHtml(c)}</p>`).join("")}
      </div>
    </div>
  `;

  // Like button handler
  const likeBtn = post.querySelector(".like-btn");
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      postData.likes++;
      updatePost(postData);
      const lc = post.querySelector(".like-count");
      if (lc) lc.textContent = `${postData.likes} likes`;
    });
  }

  // Toggle comments section
  const commentToggle = post.querySelector(".comment-toggle");
  if (commentToggle) {
    commentToggle.addEventListener("click", () => {
      const cs = post.querySelector(".comment-section");
      if (cs) cs.classList.toggle("hidden");
    });
  }

  // Add comment handler
  const addCommentBtn = post.querySelector(".add-comment");
  if (addCommentBtn) {
    addCommentBtn.addEventListener("click", () => {
      const input = post.querySelector(".comment-input input");
      const commentText = input?.value.trim();
      
      if (!commentText) {
        alert("Please write a comment!");
        return;
      }

      postData.comments.push(commentText);
      updatePost(postData);
      
      const commentsDiv = post.querySelector(".comments");
      if (commentsDiv) {
        const newComment = document.createElement("p");
        newComment.textContent = escapeHtml(commentText);
        commentsDiv.appendChild(newComment);
      }
      
      if (input) input.value = "";
    });
  }

  // Add delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-post";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.title = "Delete post";
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(postData.id);
      post.remove();
    }
  });
  
  const postHeader = post.querySelector(".post-header");
  if (postHeader) postHeader.appendChild(deleteBtn);

  // Add to feed
  if (prepend && feed.firstChild) {
    feed.insertBefore(post, feed.firstChild);
  } else {
    feed.appendChild(post);
  }
}

/**
 * Updates a post in storage
 * @param {Object} postData - Updated post data
 */
function updatePost(postData) {
  const posts = getFromStorage("posts", []);
  const index = posts.findIndex(p => p.id === postData.id);
  
  if (index !== -1) {
    posts[index] = postData;
    saveToStorage("posts", posts);
  }
}

/**
 * Deletes a post from storage
 * @param {number} postId - ID of post to delete
 */
function deletePost(postId) {
  const posts = getFromStorage("posts", []);
  const filtered = posts.filter(p => p.id !== postId);
  saveToStorage("posts", filtered);
}