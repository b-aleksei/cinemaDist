export default () => {
  const images = document.querySelectorAll('.blob-parallax');

  if (!images.length) {
    return
  }

  let ticking = false;
  let lastScrollY = 0;
  let innerHeight = document.documentElement.offsetHeight;

  function onResize() {
    innerHeight = document.documentElement.offsetHeight;
  }

  function onScroll() {

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateElements);
      lastScrollY = window.pageYOffset;
    }
  }

  function updateElements() {

    const relativeY = lastScrollY / innerHeight;

    images.forEach((img) => {
      img.style.transform = 'translate3d(0,' + relativeY * 500 + 'px, 0)';
    });

    ticking = false;
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll);

}


