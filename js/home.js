// const homeContentLinkList = document.querySelectorAll('.home-content-link');
const postHeaderYear = document.querySelector('.post-header-year span');
const postHeaderTitle = document.querySelector('.post-header-title span');
const postHeaderCategory = document.querySelector('.post-header-category span');
const postHeaderLocation = document.querySelector('.post-header-location span');

const oldTitle = document.querySelector('.post-header-title span').innerText;
const oldYear = document.querySelector('.post-header-year span').innerText;
const oldCategory = document.querySelector('.post-header-category span').innerText;
const oldLocation = document.querySelector('.post-header-location span').innerText;

const backgroundShadowMouse = document.querySelectorAll(
  '.post-details-mask-image, .home-content-hover',
);

let data;

const oldValue = {
  title: oldTitle,
  category: oldCategory,
  year: oldYear,
  location: oldLocation,
};

async function loadData() {
  const response = await fetch('./data.json');
  data = await response.json();

  return Promise.resolve();
}

function getTheImage(entryImage) {
  if (entryImage.localName === 'img') {
    const img = new Image();
    img.src = entryImage.src;
    img
      .decode()
      .then(() => entryImage.classList.add('show'))
      .catch((error) => {
        console.warn(`You got image error: ${error}`);
      });
  }
}

function createPostElement(post) {
  if (!post) return;

  const postTemplate = document.getElementById('home-content-template');
  if (!postTemplate) return;

  const homeContent1Element = postTemplate.content.firstElementChild.cloneNode(true);
  if (!homeContent1Element) return;

  const homeContentSpace = homeContent1Element.querySelector('.home-content-space-1');
  if (post.id % 2 == 0) {
    homeContentSpace.classList.add('even');
  } else {
    homeContentSpace.classList.add('odd');
  }

  const thumbnailElement = homeContent1Element.querySelector('.home-content-link img');

  thumbnailElement.onload = function () {
    const width = this.naturalWidth;
    const height = this.naturalHeight;
    const value = (height / width) * 100;

    const homeContentImage = homeContent1Element.querySelector('.home-content-image');
    if (homeContentImage) {
      homeContentImage.style.setProperty('--home-content-image-pb', `${value}%`);
    }
  };

  const homeContentLinkList = homeContent1Element.querySelector('.home-content-link');

  homeContentLinkList.addEventListener('mouseover', (event) => {
    const image =
      homeContentLinkList.querySelector('img') || homeContentLinkList.querySelector('video');
    const imageId = Number(image.dataset.id);
    const res = data.find((item) => item.id === imageId);

    if (res) {
      postHeaderYear.innerText = res.year;
      postHeaderTitle.innerText = res.title;
      postHeaderCategory.innerText = res.category;
      postHeaderLocation.innerText = res.location;
    }
  });

  homeContentLinkList.addEventListener('mouseleave', (event) => {
    const image =
      homeContentLinkList.querySelector('img') || homeContentLinkList.querySelector('video');
    const imageId = Number(image.dataset.id);
    const res = data.find((item) => item.id === imageId);

    if (res) {
      postHeaderTitle.innerText = oldValue.title;
      postHeaderYear.innerText = oldValue.year;
      postHeaderCategory.innerText = '';
      postHeaderLocation.innerText = '';
    }
  });

  if (thumbnailElement) {
    thumbnailElement.dataset.id = post.id;
    thumbnailElement.src = post.main;
  }

  const maskImageColor = homeContent1Element.querySelector('.post-details-mask-image');
  if (maskImageColor) {
    maskImageColor.style.setProperty('--home-content-hover', post.color);
  }

  const homeContentHoverElement = homeContent1Element.querySelector('.home-content-hover');
  if (homeContentHoverElement) {
    homeContentHoverElement.style.setProperty('--home-content-hover', post.color);
  }

  homeContent1Element.addEventListener('click', () => {
    window.location.assign(`post-details.html?id=${post.id}`);
  });

  return homeContent1Element;
}

function renderPostList() {
  if (!Array.isArray(data)) return;

  const homeContentElement = document.querySelector('.home-content');
  if (!homeContentElement) return;

  homeContentElement.textContent = '';

  data.forEach((post) => {
    const postElement = createPostElement(post);
    homeContentElement.appendChild(postElement);
  });
}

function init() {
  renderPostList();

  const linkObserver = '.home-content-link img.lazy, .home-content-link video.lazy';
  var lazyImages = [...document.querySelectorAll(linkObserver)];

  let lazyImageObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          getTheImage(lazyImage);
          lazyImage.classList.remove('lazy');

          let imageId = entry.target.dataset.id;
          const res = data.find((item) => item.id === +imageId);

          const errorDeclare = [null, undefined, 0, false];
          if (res instanceof Object && !errorDeclare.includes(res)) {
            oldValue.year = res.year;
            oldValue.title = res.title;
            oldValue.category = res.category;
            oldValue.location = res.location;
            postHeaderTitle.innerText = oldValue.title;
            postHeaderYear.innerText = oldValue.year;
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '5px',
      threshold: 0.5,
    },
  );

  [...lazyImages].map(function (lazyImage) {
    lazyImageObserver.observe(lazyImage);
  });
}

async function main() {
  await loadData().then(() => {
    init();
    // renderPostList();
    // appendBackgroundColor();
  });
}

main();
