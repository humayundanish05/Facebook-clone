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

    <div class="center-controls">
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
    <a href="profile.html"><img src="${reel.avatar}" class="avatar"></a>
    <a href="profile.html" class="username">${reel.username}</a>
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
  const heartIcon = container.querySelector(".fa-heart");
  let hideTimeout;
  let liked = false;

  function showControlsTemporarily() {
    controls.classList.add("visible");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      controls.classList.remove("visible");
    }, 2000);
  }

  showControlsTemporarily();

  video.addEventListener("click", () => {
    document.querySelectorAll("video").forEach(v => {
      if (v !== video) {
        v.pause();
        v.muted = true;
      }
    });

    video.muted = false;
    userUnmuted = true;

    if (video.paused) {
      video.play().catch(err => console.warn("Play error:", err));
    }

    showControlsTemporarily();
  });

  video.addEventListener("mousemove", () => {
    showControlsTemporarily();
  });

  video.addEventListener("touchstart", () => {
    showControlsTemporarily();
  });

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

  // ❤️ Double-click to show big heart and like
  video.addEventListener("dblclick", (e) => {
    // Create heart element
    const heart = document.createElement("i");
    heart.className = "fas fa-heart big-heart";
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1000);

    // Toggle heart icon color
    heartIcon.style.color = liked ? "#fff" : "red";
    liked = !liked;
  });
}, 0);
    

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

      if (userUnmuted) {
        video.muted = false;
      }
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
    video.style.objectFit = 'cover';
    video.style.objectPosition = 'center';
    video.style.display = 'block';
    video.style.margin = '0';
    video.style.padding = '0';
  });
}

adjustVideoSize();
window.addEventListener('resize', adjustVideoSize);
window.addEventListener('orientationchange', adjustVideoSize);




