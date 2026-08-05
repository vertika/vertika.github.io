document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  const prevBtn = carousel.querySelector('.carousel-arrow--prev');
  const nextBtn = carousel.querySelector('.carousel-arrow--next');

  let index = 0;
  let timer = null;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, d) => {
      dot.classList.toggle('is-active', d === index);
      dot.setAttribute('aria-selected', d === index ? 'true' : 'false');
    });
    slides.forEach((slide, s) => slide.setAttribute('aria-hidden', s === index ? 'false' : 'true'));
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, 5000);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
  }

  nextBtn.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); startAutoplay(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAutoplay(); }));

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { next(); startAutoplay(); }
    if (event.key === 'ArrowLeft') { prev(); startAutoplay(); }
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
      startAutoplay();
    }
  }, { passive: true });

  goTo(0);
  startAutoplay();
});
