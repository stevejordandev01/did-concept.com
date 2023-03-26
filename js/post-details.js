const ImageShow = document.querySelectorAll('.post-details-image');

function createPostElement(post) {
  if (!post) return;

  const postTemplate = document.getElementById('post-details-box-template');
  if (!postTemplate) return;

  const postBoxElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!postBoxElement) return;

  const postDetailsImageWrapper = document.querySelectorAll('.post-details-image-wrapper-1');
  postDetailsImageWrapper.forEach((item, index) => {
    if (index % 2 == 0) {
      item.classList.add('even');
    } else {
      item.classList.add('odd');
    }
  });

  const thumbnailElement = postBoxElement.querySelector('.post-details-image img');

  thumbnailElement.onload = function () {
    const width = this.naturalWidth;
    const height = this.naturalHeight;
    const value = (height / width) * 100;

    const postContentImage = postBoxElement.querySelector('.post-details-image');
    if (postContentImage) {
      postContentImage.style.setProperty('--post-details-image-pb', `${value}%`);
    }
  };

  if (thumbnailElement) {
    thumbnailElement.src = post;
  }

  return postBoxElement;
}

function renderPostDetail(postDetail) {
  const postDetailsContainer = document.querySelector('.post-details-container');
  if (!postDetailsContainer) return;

  postDetailsContainer.textContent = '';

  postDetail.forEach((post) => {
    const postElement = createPostElement(post);
    postDetailsContainer.appendChild(postElement);
  });
}

function GetTheImage(EntryImage) {
  const img = new Image();
  img.src = EntryImage.src;

  img.decode().then(() => EntryImage.classList.add('show'));
}

function callIntersection() {
  var lazyImages = [].slice.call(document.querySelectorAll('.post-details-image img.lazy'));

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            GetTheImage(lazyImage);
            lazyImage.classList.remove('lazy');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 1,
      },
    );

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

(function () {
  const searchParams = new URLSearchParams(window.location.search);
  const postId = searchParams.get('id');

  fetch('./data.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Work with JSON data here
      const post = data[postId - 1];
      renderPostDetail(post.detail);
      callIntersection();
    })
    .catch((err) => {
      // Do something for an error here
    });
})();
