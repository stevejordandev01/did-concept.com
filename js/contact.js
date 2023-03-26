const contactLogoImg = document.querySelector('.contact-logo-image');
let docHeight = document.documentElement.offsetHeight;

window.addEventListener('scroll', function () {
  const scrolled = 1 - window.scrollY / (docHeight - window.innerHeight);
  const transformValue = 'scale(' + scrolled + ')';

  contactLogoImg.style.transform = transformValue;
});
