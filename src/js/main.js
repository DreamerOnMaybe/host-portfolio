import '../scss/main.scss';

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
    '/youth_day/1.webp',
    '/youth_day/6.webp',
    '/youth_day/5.webp',
    '/youth_day/2.webp',
    '/youth_day/3.webp',
    '/youth_day/4.webp',
  ],

  'wedding-day': [
    '/wedding_yp/7.webp',
    '/wedding_yp/1.webp',
    '/wedding_yp/2.webp',
    '/wedding_yp/3.webp',
    '/wedding_yp/4.webp',
    '/wedding_yp/5.webp',
    '/wedding_yp/6.webp',
  ],

  'faq-bar': [
    '/faq_bar/1.webp',
    '/faq_bar/2.webp',
    '/faq_bar/3.webp',
    '/faq_bar/4.webp',
    '/faq_bar/5.webp',
  ],

  'forum': [
    '/forum/1.webp',
    '/forum/2.webp',
    '/forum/3.webp',
    '/forum/4.webp',
    '/forum/5.webp',
    '/forum/6.webp',
    '/forum/7.webp',
  ]
};

function preloadGalleryImages(images) {
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

const galleryAlt = {
  host: 'Ведущий Влад Тетеркин',
  'youth-day': 'Ведущий Влад Тетеркин на Дне молодежи',
  'wedding-day': 'Ведущий Влад Тетеркин на свадьбе',
};

const modal = document.getElementById('gallery-modal');
const modalImg = modal.querySelector('.modal__image');
const currentCountEl = modal.querySelector('.modal__current');
const totalCountEl = modal.querySelector('.modal__total');
const btnPrev = modal.querySelector('.modal__arrow--prev');
const btnNext = modal.querySelector('.modal__arrow--next');

let currentGallery = [];
let currentGalleryKey = '';
let currentIndex = 0;

function updateSlide(isInitialOpen = false) {
  currentCountEl.textContent = currentIndex + 1;
  totalCountEl.textContent = currentGallery.length;

  const hasMultiplePhotos = currentGallery.length > 1;
  btnPrev.style.display = hasMultiplePhotos ? 'block' : 'none';
  btnNext.style.display = hasMultiplePhotos ? 'block' : 'none';

  const altText = `${galleryAlt[currentGalleryKey] || 'Фото галереи'} (${currentIndex + 1} из ${currentGallery.length})`;

  if (isInitialOpen) {
    modalImg.classList.add('is-fading');
    modalImg.src = currentGallery[currentIndex];
    modalImg.alt = altText;
    modalImg.onload = () => modalImg.classList.remove('is-fading');
    return;
  }

  modalImg.classList.add('is-fading');
  setTimeout(() => {
    modalImg.src = currentGallery[currentIndex];
    modalImg.alt = altText;
    
    if (modalImg.complete) {
      modalImg.classList.remove('is-fading');
    } else {
      modalImg.onload = () => modalImg.classList.remove('is-fading');
    }
  }, 100);
}

function openGallery(galleryKey, startIndex = 0) {
  const images = galleryData[galleryKey];
  if (!images || images.length === 0) return;

  currentGallery = images;
  currentIndex = startIndex;

  preloadGalleryImages(currentGallery);

  updateSlide(true);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  if (document.activeElement && modal.contains(document.activeElement)) {
    document.activeElement.blur();
  }
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

document.querySelectorAll('[data-gallery]').forEach((card) => {
  const openAction = () => openGallery(card.dataset.gallery, 0);

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

const reviewsData = [
  {
    text: '«Хочу сказать тебе огромное спасибо за проведение нашего праздника! Ты правда очень круто отработал — с энергией, юмором и отличным чувством зала. Было спокойно за программу, атмосфера держалась весь вечер!»',
    name: 'Юлия & Павел',
    event: 'Свадьба'
  },
  {
    text: '«Влад, спасибо за вечер! Всё прошло именно так, как мы хотели: легко, смешно, стильно и без шаблонного бреда. Ты профессионал своего дела — включился на максимум, держал зал до самого конца и снял с нас весь свадебный стресс. Рады, что доверили наш день именно тебе!»',
    name: 'Юлия & Павел',
    event: 'Свадьба'
  },
  {
    text: '«И да, всё забываю написать. Спасибо тебе огромное за твой труд! Все в восторге, было просто шикарно всё. Гости не хотели расходиться, давно мы так не танцевали и не смеялись!»',
    name: 'Симоненко',
    event: 'Юбилей'
  },
  {
    text: '«Огромное спасибо за фестиваль! Влад нас просто спас: во время непредвиденной заминки он так классно держал внимание зала и импровизировал, что зрители даже ничего не заметили. Ни единого упрёка за сдвиг тайминга — максимальный профессионализм и поддержка, когда мы были на нервах. Участники и зрители в полном восторге!»',
    name: 'Feel Fest',
    event: 'Фестиваль корейских танцев'
  }
];

const reviewCard = document.querySelector('.review-card');
reviewCard?.setAttribute('aria-live', 'polite');
const reviewText = reviewCard?.querySelector('.review-card__text');
const reviewName = reviewCard?.querySelector('.review-card__name');
const reviewEvent = reviewCard?.querySelector('.review-card__event');
const reviewsBtnPrev = document.querySelector('.reviews__btn--prev');
const reviewsBtnNext = document.querySelector('.reviews__btn--next');
const reviewsDotsContainer = document.querySelector('.reviews__dots');

let currentReviewIndex = 0;

function renderReviewDots() {
  if (!reviewsDotsContainer) return;
  reviewsDotsContainer.innerHTML = '';

  reviewsData.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `reviews__dot ${index === currentReviewIndex ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
    dot.setAttribute('aria-current', index === currentReviewIndex ? 'true' : 'false');
    dot.addEventListener('click', () => setReview(index));
    reviewsDotsContainer.appendChild(dot);
  });
}

function setReview(newIndex) {
  if (newIndex === currentReviewIndex || !reviewCard) return;

  reviewCard.classList.add('is-fading');

  setTimeout(() => {
    currentReviewIndex = newIndex;
    const review = reviewsData[currentReviewIndex];

    if (reviewText) reviewText.textContent = review.text;
    if (reviewName) reviewName.textContent = review.name;
    if (reviewEvent) reviewEvent.textContent = review.event;

    // Обновляем активную точку
    const dots = reviewsDotsContainer?.querySelectorAll('.reviews__dot');
    dots?.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentReviewIndex);
      dot.setAttribute('aria-current', idx === currentReviewIndex ? 'true' : 'false');
    });

    reviewCard.classList.remove('is-fading');
  }, 180);
}

function nextReview() {
  const nextIndex = (currentReviewIndex + 1) % reviewsData.length;
  setReview(nextIndex);
}

function prevReview() {
  const prevIndex = (currentReviewIndex - 1 + reviewsData.length) % reviewsData.length;
  setReview(prevIndex);
}

reviewsBtnNext?.addEventListener('click', nextReview);
reviewsBtnPrev?.addEventListener('click', prevReview);

renderReviewDots();