import '../scss/main.scss';

console.log('App ready');

const galleryData = {
  host: [
    '/1.webp',
    '/2.webp',
    '/3.webp',
    '/4.webp',
    '/5.webp',
    '/6.webp',
    '/7.webp',
  ],

  'youth-day': [
    '/youth_day/5.webp',
    '/youth_day/6.webp',
    '/youth_day/1.webp',
    '/youth_day/2.webp',
    '/youth_day/3.webp',
    '/youth_day/4.webp',
    '/youth_day/5.webp',
  ],

  'wedding-day': [
    '/wedding_y&p/7.webp',
    '/wedding_y&p/1.webp',
    '/wedding_y&p/2.webp',
    '/wedding_y&p/3.webp',
    '/wedding_y&p/4.webp',
    '/wedding_y&p/5.webp',
    '/wedding_y&p/6.webp',
  ],

  reviews: [
    '/reviews/1.jpg',
    '/reviews/2.jpg',
    '/reviews/3.jpg',
  ]
};

const modal = document.getElementById('gallery-modal');
const modalImg = modal.querySelector('.modal__image');
const currentCountEl = modal.querySelector('.modal__current');
const totalCountEl = modal.querySelector('.modal__total');
const btnPrev = modal.querySelector('.modal__arrow--prev');
const btnNext = modal.querySelector('.modal__arrow--next');

let currentGallery = [];
let currentIndex = 0;

function updateSlide(isInitialOpen = false) {
  currentCountEl.textContent = currentIndex + 1;
  totalCountEl.textContent = currentGallery.length;

  const hasMultiplePhotos = currentGallery.length > 1;
  btnPrev.style.display = hasMultiplePhotos ? 'block' : 'none';
  btnNext.style.display = hasMultiplePhotos ? 'block' : 'none';

  if (isInitialOpen) {
    modalImg.classList.add('is-fading');
    modalImg.src = currentGallery[currentIndex];
    modalImg.onload = () => {
      modalImg.classList.remove('is-fading');
    };
    return;
  }

  modalImg.classList.add('is-fading');
  setTimeout(() => {
    modalImg.src = currentGallery[currentIndex];
    modalImg.onload = () => {
      modalImg.classList.remove('is-fading');
    };
  }, 150);
}

function openGallery(galleryKey, startIndex = 0) {
  const images = galleryData[galleryKey];
  if (!images || images.length === 0) return;

  currentGallery = images;
  currentIndex = startIndex;

  updateSlide(true);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  modalImg.classList.add('is-fading');
  setTimeout(() => {
    modalImg.src = '';
  }, 300); 
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateSlide();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateSlide();
}

document.querySelectorAll('[data-gallery], [data-project]').forEach((card) => {
  const openAction = () => {
    const key = card.dataset.gallery || card.dataset.project;

    if (key === 'reviews') {
      const allReviews = Array.from(document.querySelectorAll('[data-gallery="reviews"]'));
      const reviewIndex = allReviews.indexOf(card);
      openGallery(key, reviewIndex !== -1 ? reviewIndex : 0);
    } else {
      openGallery(key, 0);
    }
  };

  card.addEventListener('click', openAction);
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openAction();
    }
  });
});

btnNext.addEventListener('click', showNext);
btnPrev.addEventListener('click', showPrev);

modal.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeGallery);
});

document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('is-open')) return;

  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modal.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (diff > swipeThreshold) {
    showNext();
  }

  else if (diff < -swipeThreshold) {
    showPrev();
  }
}