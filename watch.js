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

const reelsWrapper = document.querySelector('.reels-wrapper');

function createReel(reel) {
  const container = document.createElement('div');
  container.className = 'reel-container';

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
        <img src="${reel.avatar}" alt="Uploader" class="avatar" />
        <p class="username"><i class="fas fa-user-circle"></i> ${reel.username}</p>
      </div>
      <p class="description">${reel.description}</p>
    </div>
  `;

  // Attach button functionality after appending
  setTimeout(() => {
    const video = container.querySelector('video');
    const controls = container.querySelector('.center-controls');
    const rewind = container.querySelector('.rewind');
    const forward = container.querySelector('.forward');
    const togglePlay = container.querySelector('.toggle-play');
    let hideTimeout;

    video.addEventListener('click', () => {
      controls.classList.remove('hidden');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        controls.classList.add('hidden');
      }, 1500);
    });

    rewind.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(video.currentTime - 5, 0);
    });

    forward.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.currentTime + 5, video.duration);
    });

    togglePlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        togglePlay.innerHTML = '<i class="fas fa-pause"></i>';
      } else {
        video.pause();
        togglePlay.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  }, 10);

  reelsWrapper.appendChild(container);
}

reelsData.forEach(createReel);

// Auto play only visible video
function handleVisibleVideoPlayback() {
  const videos = document.querySelectorAll('.reel-container video');
  videos.forEach(video => {
    const rect = video.getBoundingClientRect();
    const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    if (fullyVisible) {
      video.play();
    } else {
      video.pause();
    }
  });
}

window.addEventListener('load', handleVisibleVideoPlayback);
window.addEventListener('resize', handleVisibleVideoPlayback);
document.querySelector('.reels-wrapper').addEventListener('scroll', () => {
  setTimeout(handleVisibleVideoPlayback, 150);
});
