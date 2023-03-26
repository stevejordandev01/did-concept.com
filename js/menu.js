const menuMobileBtn = document.querySelector('.menu-mobile-btn');

menuMobileBtn.addEventListener('click', function () {
  const menuMobileOverlay = document.querySelector('.menu-mobile-overlay-container');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const xIcon = document.querySelector('.x-icon');

  menuMobileOverlay.classList.toggle('block');
  hamburgerIcon.classList.toggle('hidden');
  xIcon.classList.toggle('block');
});
