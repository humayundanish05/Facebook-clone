const reelData = [
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
    description: "Ya allah mujhe maaf kar de😭"
  }
];

function createReelElement({ video, avatar, username, description }) {
  const reel = document.createElement("div");
  reel.className = "reel-container";
  reel.innerHTML = `
    <video src="${video}" autoplay loop  playsinline></video>

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
        <img src="${avatar}" alt="Uploader" class="avatar" />
        <p class="username"><i class="fas fa-user-circle"></i> ${username}</p>
      </div>
      <p class="description">${description}</p>
    </div>
  `;
  return reel;
}

function loadReels() {
  const wrapper = document.getElementById("reelsWrapper");
  reelData.forEach(data => {
    const reelElement = createReelElement(data);
    wrapper.appendChild(reelElement);
  });
}

function adjustReelInfoPosition() {
  document.querySelectorAll('.reel-info').forEach(reelInfo => {
    const screenHeight = window.innerHeight;
    let bottomOffset = screenHeight < 600 ? 120 : 100;
    reelInfo.style.bottom = bottomOffset + 'px';
  });
}

function setupCenterControlsAutoHide() {
  document.querySelectorAll('.center-controls').forEach(centerControls => {
    let hideTimeout;
    function showControls() {
      centerControls.style.opacity = '1';
      centerControls.style.pointerEvents = 'auto';
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        centerControls.style.opacity = '0';
        centerControls.style.pointerEvents = 'none';
      }, 2000);
    }
    showControls();
    document.addEventListener('click', e => {
      if (e.target.closest('.center-controls')) return;
      showControls();
    });
  });
}

function setupVideoAutoPlay() {
  const wrapper = document.querySelector('.reels-wrapper');
  function checkVisibleVideo() {
    document.querySelectorAll('.reel-container video').forEach(video => {
      const rect = video.getBoundingClientRect();
      const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      fullyVisible ? video.play() : video.pause();
    });
  }

  wrapper.addEventListener('scroll', () => {
    setTimeout(checkVisibleVideo, 100);
  });

  checkVisibleVideo();
}

window.addEventListener('load', () => {
  loadReels();
  adjustReelInfoPosition();
  setupCenterControlsAutoHide();
  setupVideoAutoPlay();
});
window.addEventListener('resize', adjustReelInfoPosition);
