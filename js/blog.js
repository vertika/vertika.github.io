function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function loadBlogList() {
  const container = document.getElementById('posts-list');
  if (!container) return;

  try {
    const res = await fetch('/posts/manifest.json');
    if (!res.ok) throw new Error();
    const posts = await res.json();

    if (!posts.length) {
      container.innerHTML = '<p class="no-posts">No posts yet. Check back soon.</p>';
      return;
    }

    container.innerHTML = `<ul class="post-list">${posts.map(post => `
      <li class="post-entry">
        <a href="/post.html?slug=${encodeURIComponent(post.slug)}">
          <div class="post-entry-header">
            <span class="post-title">${post.title}</span>
            <time class="post-date" datetime="${post.date}">${formatDate(post.date)}</time>
          </div>
          <p class="post-excerpt">${post.excerpt}<span class="post-arrow"> →</span></p>
        </a>
      </li>`).join('')}
    </ul>`;
  } catch {
    container.innerHTML = '<p class="no-posts">Could not load posts.</p>';
  }
}

async function loadSinglePost() {
  const container = document.getElementById('post-content');
  if (!container) return;

  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) { location.href = '/blog.html'; return; }

  try {
    const res = await fetch(`/posts/${encodeURIComponent(slug)}.md`);
    if (!res.ok) throw new Error();
    const md = await res.text();

    // Strip the leading h1 and any immediately-following date italic to pull them out
    // and render them in the styled header — so the Markdown stays clean.
    let processed = md;
    let title = '';
    let dateLine = '';

    const titleMatch = processed.match(/^#\s+(.+)\n/);
    if (titleMatch) {
      title = titleMatch[1];
      processed = processed.slice(titleMatch[0].length);
    }

    const dateMatch = processed.match(/^\*([^*]+)\*\n\n?/);
    if (dateMatch) {
      dateLine = dateMatch[1];
      processed = processed.slice(dateMatch[0].length);
    }

    const body = marked.parse(processed);

    container.innerHTML = `
      <h1>${title || slug}</h1>
      ${dateLine ? `<p class="post-meta-line">${dateLine}</p>` : ''}
      ${body}
    `;

    if (title) document.title = title + ' — Vertika';
  } catch {
    container.innerHTML = '<p class="loading-text">Post not found.</p>';
  }
}

loadBlogList();
loadSinglePost();
