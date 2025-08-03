const reelsData = [
  {
    video: "video1.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "sight loss😭"
  },
  {
    video: "video2.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Ya Allah tu mujhe maaf krde😭"
  },
  {
    video: "video3.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "pa be didana mulaqat sang gozara wakama😭"
  },
  {
    video: "video4.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "starge de moor 🥀 pase garzege kna😭"
  },
  {
    video: "video5.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "che me qabar la raze pa jara nashe😭"
  },
  {
    video: "video6.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "che na saroona de hagha sang-e-marmar la na ze😒"
  }
];

const reelsWrapper = document.querySelector(".reels-wrapper");
let userUnmuted = false;

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

    // Show controls for 2s initially
    controls.classList.remove("hidden");
    hideTimeout = setTimeout(() => {
      controls.classList.add("hidden");
    }, 2000);

    const showControls = () => {
      controls.classList.remove("hidden");
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.add("hidden");
      }, 2000);
    };

    video.addEventListener("click", () => {
      document.querySelectorAll("video").forEach(v => {
        if (v !== video) {
          v.pause();
          v.muted = true;
        }
      });

      userUnmuted = true; // ✅ Mark that user unmuted a video

      video.muted = false;
      if (video.paused) {
        video.play().catch(err => console.warn("Play error:", err));
        toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
      }

      showControls();
    });

    video.addEventListener("mousemove", showControls);

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

function handlePlayback() {
  const videos = document.querySelectorAll(".reel-container video");

  videos.forEach((video) => {
    const rect = video.getBoundingClientRect();
    const visible = rect.top < window.innerHeight && rect.bottom > 0;

    if (visible) {
      video.play().catch(() => {});

      if (userUnmuted) {
        video.muted = false; // ✅ Auto unmute future videos after first manual unmute
      }
    } else {
      video.pause();
      video.muted = true;
    }
  });
}

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

// ✅ Create reels only after sizing
reelsData.forEach(createReel);

// ✅ Scroll & visibility
window.addEventListener("load", handlePlayback);
window.addEventListener("resize", handlePlayback);
document.querySelector(".reels-wrapper").addEventListener("scroll", () => {
  setTimeout(handlePlayback, 100);
});
