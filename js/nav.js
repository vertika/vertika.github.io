document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (!header) return;

  header.innerHTML = `
    <nav>
      <a href="/" class="site-name">Vertika</a>
      <ul>
        <li><a href="/">about</a></li>
        <li><a href="/classes.html">classes</a></li>
        <li><a href="/blog.html">blog</a></li>
      </ul>
    </nav>
  `;

  const filename = location.pathname.split('/').pop() || '';

  header.querySelectorAll('ul a').forEach(a => {
    const href = a.getAttribute('href');
    const hrefFile = href.split('/').pop() || '';

    const isHome = href === '/' && (filename === '' || filename === 'index.html');
    const isPage = hrefFile && filename === hrefFile;

    if (isHome || isPage) a.classList.add('active');
  });
});
