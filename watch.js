function adjustReelInfoPosition() {
    const reelInfo = document.querySelector('.reel-info');
    const screenHeight = window.innerHeight;


    // Safe zone above mobile nav buttons (like 80-120px)
    let bottomOffset = 100;


    // If screen height is very small (e.g. 500px phones), reduce bottom offset
    if (screenHeight < 600) {
      bottomOffset = 120;
    }


    reelInfo.style.bottom = bottomOffset + 'px';
  }


  // Call on page load and when screen resizes
  window.addEventListener('load', adjustReelInfoPosition);
  window.addEventListener('resize', adjustReelInfoPosition);

window.addEventListener('load', () => {
  const centerControls = document.querySelector('.center-controls');
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

  showControls(); // Initial show + auto-hide
  document.addEventListener('click', showControls); // Show on tap
});
