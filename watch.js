const reelsData = [
  {
    video: "video2.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Ya Allah tu mujhe maaf krde😭"
  },
  {
    video: "video1.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Ya Allah tu mujhe maaf krde😭"
  },
];

const reelsWrapper = document.querySelector(".reels-wrapper");

function createReel(reel) {
  const container = document.createElement("div");
  container.className = "reel-container";

  container.innerHTML = `
    <video src="${reel.video}" autoplay loop muted playsinline></video>

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

  setTimeout(() => {
    const video = container.querySelector("video");
    const controls = container.querySelector(".center-controls");
    const rewindBtn = controls.querySelector(".rewind");
    const forwardBtn = controls.querySelector(".forward");
    const toggleBtn = controls.querySelector(".toggle-play");
    let hideTimeout;

    // Show controls on load for 1.5s
    controls.classList.remove("hidden");
    hideTimeout = setTimeout(() => {
      controls.classList.add("hidden");
    }, 1500);

    // Show controls on video click
    video.addEventListener("click", () => {
      // Pause others and unmute this one
      document.querySelectorAll("video").forEach(v => {
        if (v !== video) {
          v.pause();
          v.muted = true;
        }
      });

      video.muted = false;
      if (video.paused) {
        video.play().catch(err => console.warn("Play error:", err));
      }

      controls.classList.remove("hidden");
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.add("hidden");
      }, 1500);
    });

    // Button actions
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

// Create all reels
reelsData.forEach(createReel);

// Playback based on scroll visibility
function handlePlayback() {
  const videos = document.querySelectorAll(".reel-container video");
  videos.forEach((video) => {
    const rect = video.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;
    if (visible) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.muted = true;
    }
  });
}

// Scroll and resize events
window.addEventListener("load", handlePlayback);
window.addEventListener("resize", handlePlayback);
document.querySelector(".reels-wrapper").addEventListener("scroll", () => {
  setTimeout(handlePlayback, 100);
});

// Adjust video size to full screen
function adjustVideoSize() {
  const reels = document.querySelectorAll('.reel-container video');
  const height = window.innerHeight;
  const width = window.innerWidth;

  reels.forEach(video => {
    video.style.height = height + 'px';
    video.style.width = width + 'px';
  });
}

adjustVideoSize();
window.addEventListener('resize', adjustVideoSize);
window.addEventListener('orientationchange', adjustVideoSize);
