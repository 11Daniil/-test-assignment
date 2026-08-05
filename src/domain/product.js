export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  SOLD: 'sold',
});

const PRODUCT_STATUSES = Object.values(PRODUCT_STATUS);
const PRODUCT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const moneyFormatters = new Map();

const assert = (condition, message) => {
  if (!condition) {
    throw new TypeError(`[product] ${message}`);
  }
};

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const normalizeImage = (image, productId, index) => {
  assert(image && typeof image === 'object', `${productId}: image ${index + 1} is invalid`);
  assert(isNonEmptyString(image.src), `${productId}: image ${index + 1} has no src`);
  assert(isNonEmptyString(image.alt), `${productId}: image ${index + 1} has no alt`);

  const zoom = image.zoom === undefined ? 1 : Number(image.zoom);
  assert(Number.isFinite(zoom) && zoom >= 1, `${productId}: image ${index + 1} has invalid zoom`);

  return Object.freeze({
    id: image.id || `${productId}-${index + 1}`,
    src: image.src,
    thumbnailSrc: image.thumbnailSrc || image.src,
    alt: image.alt,
    position: image.position || '50% 50%',
    zoom,
  });
};

const normalizePrice = (price, productId) => {
  assert(price && typeof price === 'object', `${productId}: available product requires a price`);
  assert(
    Number.isSafeInteger(price.current) && price.current > 0,
    `${productId}: current price must be a positive integer`,
  );
  assert(isNonEmptyString(price.currency), `${productId}: price currency is required`);

  if (price.previous !== null && price.previous !== undefined) {
    assert(
      Number.isSafeInteger(price.previous) && price.previous > price.current,
      `${productId}: previous price must be greater than current price`,
    );
  }

  return Object.freeze({
    current: price.current,
    previous: price.previous || null,
    currency: price.currency,
  });
};

/**
 * Creates and validates an immutable catalog product.
 * Static fixture errors therefore fail during development/build instead of at runtime in the UI.
 */
export const createProduct = (definition) => {
  assert(definition && typeof definition === 'object', 'product definition is required');
  assert(PRODUCT_ID_PATTERN.test(definition.id), 'product id must be a stable slug');
  assert(isNonEmptyString(definition.title), `${definition.id}: title is required`);
  assert(isNonEmptyString(definition.author), `${definition.id}: author is required`);
  assert(isNonEmptyString(definition.description), `${definition.id}: description is required`);
  assert(PRODUCT_STATUSES.includes(definition.status), `${definition.id}: unsupported status`);
  assert(
    Array.isArray(definition.images) &&
      definition.images.length >= 2 &&
      definition.images.length <= 4,
    `${definition.id}: gallery must contain from 2 to 4 images`,
  );

  const isAvailable = definition.status === PRODUCT_STATUS.AVAILABLE;
  const price = isAvailable ? normalizePrice(definition.price, definition.id) : null;

  if (!isAvailable) {
    assert(isNonEmptyString(definition.soldLabel), `${definition.id}: sold label is required`);
  }

  return Object.freeze({
    id: definition.id,
    title: definition.title,
    author: definition.author,
    description: definition.description,
    status: definition.status,
    price,
    soldLabel: definition.soldLabel || '',
    images: Object.freeze(
      definition.images.map((image, index) => normalizeImage(image, definition.id, index)),
    ),
  });
};

export const isProductAvailable = (product) =>
  Boolean(product && product.status === PRODUCT_STATUS.AVAILABLE);

export const formatMoney = (amount, currency) => {
  const cacheKey = `${currency}:ru-RU`;

  if (!moneyFormatters.has(cacheKey)) {
    moneyFormatters.set(
      cacheKey,
      new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    );
  }

  return moneyFormatters.get(cacheKey).format(amount);
};

export const normalizeSearchQuery = (query) =>
  String(query || '')
    .trim()
    .toLocaleLowerCase('ru-RU');

export const filterProductsByTitle = (products, query) => {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) =>
    product.title.toLocaleLowerCase('ru-RU').includes(normalizedQuery),
  );
};

export const pluralize = (count, [one, few, many]) => {
  const absoluteCount = Math.abs(count);
  const lastTwoDigits = absoluteCount % 100;
  const lastDigit = absoluteCount % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many;
  }

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  return many;
};

export const getSearchResultLabel = (query, count) => {
  if (!normalizeSearchQuery(query)) {
    return '';
  }

  return `${count} ${pluralize(count, ['позиция', 'позиции', 'позиций'])}`;
};
