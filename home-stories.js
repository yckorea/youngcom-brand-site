const homeStoryList = document.querySelector('[data-home-stories]');

if (homeStoryList) {
  const formatStoryDate = (value) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { day: '', rest: value || '' };
    return {
      day: String(date.getDate()).padStart(2, '0'),
      rest: `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`
    };
  };

  const hrefForStory = (post) => post.url
    ? `story/${post.url}`
    : `story/post.html?id=${encodeURIComponent(post.id || '')}`;

  const renderHomeStories = (posts) => {
    const latest = [...posts]
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
      .slice(0, 3);

    if (!latest.length) {
      homeStoryList.innerHTML = '<p class="catalog-error">아직 등록된 이야기가 없습니다.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    latest.forEach((post) => {
      const link = document.createElement('a');
      link.className = 'story-item reveal visible';
      link.href = hrefForStory(post);

      const date = formatStoryDate(post.date);
      const dateBox = document.createElement('div');
      dateBox.className = 'story-date';
      const day = document.createElement('strong');
      day.textContent = date.day;
      const rest = document.createElement('span');
      rest.textContent = date.rest;
      dateBox.append(day, rest);

      const copy = document.createElement('div');
      const category = document.createElement('span');
      category.className = 'category';
      category.textContent = Array.isArray(post.tags) && post.tags.length ? post.tags[0] : '영컴통신 이야기';
      const title = document.createElement('h3');
      title.textContent = post.title || '(제목 없음)';
      const summary = document.createElement('p');
      summary.textContent = post.summary || '';
      copy.append(category, title, summary);

      const arrow = document.createElement('span');
      arrow.className = 'round-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(dateBox, copy, arrow);
      fragment.appendChild(link);
    });
    homeStoryList.replaceChildren(fragment);
  };

  const homeStoriesUrl = location.protocol === 'file:'
    ? 'https://raw.githubusercontent.com/yckorea/youngcom-brand-site/main/story/posts.json'
    : 'story/posts.json';

  fetch(homeStoriesUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    })
    .then(renderHomeStories)
    .catch(() => {
      homeStoryList.innerHTML = '<p class="catalog-error">이야기를 불러오지 못했습니다. 이야기 페이지에서 확인해 주세요.</p>';
    });
}
