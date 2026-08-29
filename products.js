const productLists = document.querySelectorAll('[data-product-list]');

const productCard = (product) => {
  const article = document.createElement('article');
  article.className = 'catalog-card reveal visible';
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.name;
  image.loading = 'lazy';
  image.decoding = 'async';

  const body = document.createElement('div');
  body.className = 'catalog-card-body';
  const name = document.createElement('h3');
  name.textContent = product.name;
  const price = document.createElement('p');
  price.className = 'catalog-price';
  price.textContent = typeof product.price === 'number'
    ? `${new Intl.NumberFormat('ko-KR').format(product.price)}원`
    : product.price;
  const link = document.createElement('a');
  link.className = 'catalog-buy';
  link.href = product.purchaseUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = '구매하기 <span aria-hidden="true">↗</span>';

  body.append(name, price, link);
  article.append(image, body);
  return article;
};

const loadProducts = async () => {
  try {
    const productDataUrl = location.protocol === 'file:'
      ? 'https://raw.githubusercontent.com/yckorea/youngcom-brand-site/main/products.json'
      : 'products.json';
    const response = await fetch(productDataUrl);
    if (!response.ok) throw new Error('제품 정보를 불러오지 못했습니다.');
    const products = await response.json();

    productLists.forEach((list) => {
      const limit = Number(list.dataset.limit || products.length);
      const items = list.dataset.featured === 'true'
        ? products.filter((product) => product.featured).slice(0, limit)
        : products.slice(0, limit);
      list.replaceChildren(...items.map(productCard));
    });
  } catch (error) {
    productLists.forEach((list) => {
      list.innerHTML = '<p class="catalog-error">제품 정보를 불러오지 못했습니다. 로컬 파일은 간단한 웹 서버에서 열거나 스마트스토어에서 확인해 주세요.</p>';
    });
  }
};

loadProducts();
