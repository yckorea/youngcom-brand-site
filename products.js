const productLists = document.querySelectorAll('[data-product-list]');

const productCard = (product, isHero = false) => {
  const article = document.createElement('article');
  article.className = `catalog-card reveal visible${isHero ? ' catalog-card--hero' : ''}`;
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.name;
  image.loading = isHero ? 'eager' : 'lazy';
  image.decoding = 'async';

  const body = document.createElement('div');
  body.className = 'catalog-card-body';
  const name = document.createElement('h3');
  name.textContent = product.name;
  const tagline = document.createElement('p');
  tagline.className = 'catalog-tagline';
  tagline.textContent = product.tagline || '현장에 맞는 제품을 확인해 보세요';
  const price = document.createElement('p');
  price.className = 'catalog-price';
  price.textContent = typeof product.price === 'number'
    ? `${new Intl.NumberFormat('ko-KR').format(product.price)}원`
    : product.price;

  const actions = document.createElement('div');
  actions.className = 'catalog-actions';
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'catalog-buy';
  addButton.setAttribute('data-cart-add', '');
  addButton.dataset.name = product.name;
  addButton.dataset.price = String(Number(product.price) || 0);
  addButton.dataset.url = product.purchaseUrl;
  addButton.innerHTML = '장바구니 담기 <span aria-hidden="true">＋</span>';
  const storeLink = document.createElement('a');
  storeLink.className = 'catalog-store';
  storeLink.href = product.purchaseUrl;
  storeLink.target = '_blank';
  storeLink.rel = 'noopener noreferrer';
  storeLink.innerHTML = '바로 구매 <span aria-hidden="true">↗</span>';
  actions.append(addButton, storeLink);

  body.append(name, tagline, price, actions);
  article.append(image, body);
  return article;
};

const loadProducts = async () => {
  try {
    const productDataUrl = location.protocol === 'file:'
      ? 'https://raw.githubusercontent.com/yckorea/youngcom-brand-site/main/products.json'
      : 'products.json';
    const response = await fetch(productDataUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('제품 정보를 불러오지 못했습니다.');
    const products = await response.json();

    productLists.forEach((list) => {
      const limit = Number(list.dataset.limit || products.length);
      if (list.dataset.curated === 'true') {
        const hero = products.find((product) => product.featured) || products[0];
        if (!hero) return list.replaceChildren();
        const grid = document.createElement('div');
        grid.className = 'catalog-grid catalog-grid--secondary';
        const rest = products.filter((product) => product !== hero).slice(0, limit);
        grid.replaceChildren(...rest.map((product) => productCard(product)));
        list.replaceChildren(productCard(hero, true), grid);
        return;
      }
      list.replaceChildren(...products.slice(0, limit).map((product) => productCard(product)));
    });
  } catch (error) {
    productLists.forEach((list) => {
      list.innerHTML = '<p class="catalog-error">제품 정보를 불러오지 못했습니다. 로컬 파일은 간단한 웹 서버에서 열거나 스마트스토어에서 확인해 주세요.</p>';
    });
  }
};

loadProducts();
