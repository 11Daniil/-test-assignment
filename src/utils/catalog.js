export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
};

export const isProductAvailable = (product) => product.status === PRODUCT_STATUS.AVAILABLE;

export const formatPrice = (amount, currency = 'USD') =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export const filterProductsByTitle = (products, query) => {
  const search = query.trim().toLocaleLowerCase('ru-RU');

  if (!search) {
    return products;
  }

  return products.filter((product) => product.title.toLocaleLowerCase('ru-RU').includes(search));
};

const getWordForm = (count) => {
  const lastTwoDigits = Math.abs(count) % 100;
  const lastDigit = lastTwoDigits % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'позиций';
  }

  if (lastDigit === 1) {
    return 'позиция';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'позиции';
  }

  return 'позиций';
};

export const getSearchResultLabel = (query, count) =>
  query.trim() ? `${count} ${getWordForm(count)}` : '';
