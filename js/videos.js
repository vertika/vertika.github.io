document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.video-card');

  function play(card) {
    const id = card.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    iframe.title = 'YouTube video player';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    card.replaceChildren(iframe);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => play(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        play(card);
      }
    });
  });
});
