const reelsData = [
  {
    video: "video2.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "First reel, enjoy! 😄"
  },
  {
    video: "video1.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Gulali mashooman 🥰😀 #fun #reels"
  }
];

const reelsWrapper = document.querySelector(".reels-wrapper");

function createReel(reel) {
  const container = document.createElement("div");
  container.className = "reel-container";

  container.innerHTML = `
    <video src="${reel.video}" autoplay loop playsinline></video>

    <div class="center-controls hidden">
      <button class="rewind"><i class="fas fa-undo"></i></button>
      <button class="toggle-play"><i class="fas fa-pause"></i></button>
      <button class="forward"><i class="fas fa-redo"></i></button>
    </div>

    <div class="reel-actions">
      <button><i class="fas fa-heart"></i></button>
      <button><i class="fas fa-comment"></i></button>
      <button><i class="fas fa-share"></i></button>
      <button><i class="fas fa-bookmark"></i></button>
      <button><i class="fas fa-ellipsis-v"></i></button>
    </div>

    <div class="reel-info">
      <div class="user-row">
        <img src="${reel.avatar}" class="avatar">
        <p class="username">${reel.username}</p>
      </div>
      <p class="description">${reel.description}</p>
    </div>
  `;

  reelsWrapper.appendChild(container);

  // Setup event listeners after DOM is ready
  setTimeout(() => {
    const video = container.querySelector("video");
    const controls = container.querySelector(".center-controls");
    const rewindBtn = controls.querySelector(".rewind");
    const forwardBtn = controls.querySelector(".forward");
    const toggleBtn = controls.querySelector(".toggle-play");
    let hideTimeout;

    // Show controls on single click
    video.addEventListener("click", () => {
      controls.classList.remove("hidden");
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.add("hidden");
      }, 1500);
    });

    // Control buttons functionality
    rewindBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(video.currentTime - 5, 0);
    });

    forwardBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.currentTime + 5, video.duration);
    });

    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  }, 0);
}

// Create reels
reelsData.forEach(createReel);

// Pause all except visible
function handlePlayback() {
  const videos = document.querySelectorAll(".reel-container video");
  videos.forEach((video) => {
    const rect = video.getBoundingClientRect();
    const visible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (visible) {
      video.muted = false;
      video.play();
    } else {
      video.pause();
      video.muted = true;
    }
  });
}

window.addEventListener("load", handlePlayback);
window.addEventListener("resize", handlePlayback);
document.querySelector(".reels-wrapper").addEventListener("scroll", () => {
  setTimeout(handlePlayback, 100);
});
