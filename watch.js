// Adjust the position of reel info box (e.g., above mobile nav)
function adjustReelInfoPosition() {
  const reelInfo = document.querySelector('.reel-info');
  if (!reelInfo) return;

  const screenHeight = window.innerHeight;
  let bottomOffset = screenHeight < 600 ? 120 : 100;

  reelInfo.style.bottom = bottomOffset + 'px';
}
function setupCenterControlsAutoHide() {
  const centerControls = document.querySelector('.center-controls');
  if (!centerControls) return;

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
document.addEventListener('click', (e) => {
    if (!e.target.closest('button')) {
      showControls();
    }
  });
}
window.addEventListener('load', () => {
  adjustReelInfoPosition();
  setupCenterControlsAutoHide();
});
window.addEventListener('resize', adjustReelInfoPosition);
window.addEventListener('load', () => {
  const videos = document.querySelectorAll('.reel-container video');

  function checkVisibleVideo() {
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
 document.querySelector('.reels-wrapper').addEventListener('scroll', () => {
    setTimeout(checkVisibleVideo, 100);
  });

  checkVisibleVideo(); // initial check
});
