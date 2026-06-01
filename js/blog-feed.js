document.addEventListener('DOMContentLoaded', function () {
  const resolvePath = (value, basePath) => {
    if (!value) {
      return '';
    }
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    const normalisedBase = basePath && basePath !== '/' ? basePath.replace(/\/$/, '') : '';
    const normalisedValue = value.startsWith('/') ? value : `/${value}`;
    if (!normalisedBase) {
      return normalisedValue;
    }
    if (normalisedValue.startsWith(`${normalisedBase}/`) || normalisedValue === normalisedBase) {
      return normalisedValue;
    }
    return `${normalisedBase}${normalisedValue}`;
  };

  const feeds = document.querySelectorAll('.blog-feed[data-blog-feed]');
  if (!feeds.length) {
    return;
  }

  feeds.forEach(section => {
    const feedUrl = section.dataset.blogFeed;
    if (!feedUrl) {
      return;
    }

    const basePath = section.dataset.blogBase || '';
    const fallbackImg = resolvePath(section.dataset.blogFallbackImg || '/assets/img/blog/placeholder.svg', basePath);
    const ctaText = section.dataset.blogCta || 'Read more';
    const emptyText = section.dataset.blogEmptyText || 'No posts available right now.';
    const errorText = section.dataset.blogErrorText || emptyText;
    const errorLink = section.dataset.blogFallbackLink || 'https://blog.greenairiva.com.tr/';
    const errorLinkLabel = section.dataset.blogErrorLinkLabel || 'blog';
    const limit = parseInt(section.dataset.blogLimit, 10);

    fetch(feedUrl, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load feed');
        }
        return response.json();
      })
      .then(items => {
        const posts = Array.isArray(items) ? items : [];
        const published = posts.filter(item => !item.draft);
        const visiblePosts = Number.isFinite(limit) && limit > 0 ? published.slice(0, limit) : published;

        section.innerHTML = '';

        if (!visiblePosts.length) {
          const col = document.createElement('div');
          col.className = 'col-12';
          const message = document.createElement('p');
          message.className = 'text-muted mb-0';
          message.textContent = emptyText;
          col.appendChild(message);
          section.appendChild(col);
          return;
        }

        visiblePosts.forEach(post => {
          const col = document.createElement('div');
          col.className = 'col-12 col-sm-6 col-lg-4 d-flex';

          const card = document.createElement('div');
          card.className = 'blog-card w-100';

          const imgWrapper = document.createElement('div');
          imgWrapper.className = 'blog-card-img';

          const img = document.createElement('img');
          img.src = resolvePath(post.image || '', basePath) || fallbackImg;
          img.alt = post.image_alt || post.title || '';
          img.loading = 'lazy';
          img.onerror = () => {
            if (img.src !== fallbackImg) {
              img.src = fallbackImg;
            }
          };
          imgWrapper.appendChild(img);

          const body = document.createElement('div');
          body.className = 'blog-card-body';

          const title = document.createElement('h3');
          title.textContent = post.title || '';
          body.appendChild(title);

          if (Array.isArray(post.tags) && post.tags.length) {
            const tagList = document.createElement('ul');
            tagList.className = 'blog-card-tags list-unstyled';
            post.tags.filter(Boolean).forEach(tag => {
              const li = document.createElement('li');
              li.textContent = tag;
              tagList.appendChild(li);
            });
            body.appendChild(tagList);
          }

          const summary = document.createElement('p');
          summary.textContent = post.summary || post.description || '';
          body.appendChild(summary);

          const link = document.createElement('a');
          link.className = 'read-blog-btn';
          link.href = resolvePath(post.content || '#', basePath);
          link.rel = 'bookmark';
          link.setAttribute('aria-label', `${ctaText} – ${post.title || ''}`.trim());

          const textNode = document.createElement('span');
          textNode.textContent = ctaText;
          link.appendChild(textNode);

          const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          icon.setAttribute('width', '1.1em');
          icon.setAttribute('height', '1.1em');
          icon.setAttribute('viewBox', '0 0 20 20');
          icon.setAttribute('fill', 'none');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M5 10H15M15 10L11.5 6.5M15 10L11.5 13.5');
          path.setAttribute('stroke', 'white');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('stroke-linecap', 'round');
          path.setAttribute('stroke-linejoin', 'round');
          icon.appendChild(path);

          link.appendChild(icon);

          body.appendChild(link);

          card.appendChild(imgWrapper);
          card.appendChild(body);
          col.appendChild(card);
          section.appendChild(col);
        });
      })
      .catch(() => {
        section.innerHTML = '';
        const col = document.createElement('div');
        col.className = 'col-12';
        const message = document.createElement('p');
        message.className = 'text-muted mb-0';
        message.append(document.createTextNode(`${errorText} `));
        const linkEl = document.createElement('a');
        linkEl.className = 'link-primary';
        linkEl.href = errorLink;
        linkEl.textContent = errorLinkLabel;
        message.append(linkEl);
        message.append(document.createTextNode('.'));
        col.appendChild(message);
        section.appendChild(col);
      });
  });
});
