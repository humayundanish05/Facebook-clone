const reelsData = [
  {
    video: "video2.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Gulali mashooman 🥰😀 #fun #reels"
  },
  {
    video: "video1.mp4",
    avatar: "user.jpg",
    username: "@HumayunDanish",
    description: "Second reel video ✌️🔥"
  }
];

// Dynamically build reels
const wrapper = document.getElementById('reels-wrapper');

reelsData.forEach(data => {
  const reel = document.createElement('div');
  reel.className = 'reel-container';

  reel.innerHTML = `
    <video src="${data.video}" autoplay loop muted playsinline></video>

    <div class="center-controls">
      <button><i class="fas fa-undo"></i></button>
      <button><i class="fas fa-play"></i></button>
      <button><i class="fas fa-redo"></i></button>
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
        <img src="${data.avatar}" alt="Uploader" class="avatar" />
        <p class="username"><i class="fas fa-user-circle"></i> ${data.username}</p>
      </div>
      <p class="description">${data.description}</p>
    </div>
  `;

  wrapper.appendChild(reel);
});

// Adjust Info Position (bottom safe zone)
function adjustReelInfoPosition() {
  document.querySelectorAll('.reel-info').forEach(info => {
    const screenHeight = window.innerHeight;
    let bottomOffset = screenHeight < 600 ? 120 : 100;
    info.style.bottom = bottomOffset + 'px';
  });
}

// Auto-hide center controls
function setupAutoHideControls() {
  document.querySelectorAll('.center-controls').forEach(controls => {
    let timeout;
    function show() {
      controls.style.opacity = '1';
      controls.style.pointerEvents = 'auto';
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        controls.style.opacity = '0';
        controls.style.pointerEvents = 'none';
      }, 2000);
    }
    show();
    document.addEventListener('click', e => {
      if (!e.target.closest('button')) show();
    });
  });
}

// Only play visible video
function setupVideoScrollPlay() {
  const videos = document.querySelectorAll('video');

  function checkVisible() {
    videos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (fullyVisible) {
        video.play().catch(e => console.log("Playback error:", e));
      } else {
        video.pause();
      }
    });
  }

  document.querySelector('.reels-wrapper').addEventListener('scroll', () => {
    setTimeout(checkVisible, 100);
  });

  checkVisible();
}

window.addEventListener('load', () => {
  adjustReelInfoPosition();
  setupAutoHideControls();
  setupVideoScrollPlay();
});
window.addEventListener('resize', adjustReelInfoPosition);

// Wait for user interaction (like click anywhere)
document.addEventListener("click", () => {
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    video.muted = false;
    video.play().catch(err => console.log("Play error:", err));
  });
});
