// Adjust the position of reel info box (e.g., above mobile nav)
function adjustReelInfoPosition() {
  const reelInfo = document.querySelector('.reel-info');
  if (!reelInfo) return;

  const screenHeight = window.innerHeight;
  let bottomOffset = screenHeight < 600 ? 120 : 100;

  reelInfo.style.bottom = bottomOffset + 'px';
}

// Auto-hide center video controls
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

  // Show again when user taps/clicks anywhere
  document.addEventListener('click', (e) => {
    // Optional: Only trigger if user didn't click a button
    if (!e.target.closest('button')) {
      showControls();
    }
  });
}

// Initialize both on load and resize
window.addEventListener('load', () => {
  adjustReelInfoPosition();
  setupCenterControlsAutoHide();
});

window.addEventListener('resize', adjustReelInfoPosition);
