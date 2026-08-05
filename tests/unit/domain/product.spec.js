import {
  createProduct,
  filterProductsByTitle,
  getSearchResultLabel,
  isProductAvailable,
  PRODUCT_STATUS,
} from '../../../src/domain/product';

const createDefinition = (overrides = {}) => ({
  id: 'test-product',
  title: 'Тестовая картина',
  author: 'Тестовый автор',
  description: 'Краткое описание тестовой картины.',
  status: PRODUCT_STATUS.AVAILABLE,
  price: {
    current: 1_000,
    previous: 2_000,
    currency: 'USD',
  },
  images: [
    { src: '/images/one.jpg', alt: 'Первый вид' },
    { src: '/images/two.jpg', alt: 'Второй вид', position: '25% 50%', zoom: 1.5 },
  ],
  ...overrides,
});

describe('product domain', () => {
  describe('createProduct', () => {
    it('validates, normalizes and freezes an available product', () => {
      const product = createProduct(createDefinition());

      expect(product).toMatchObject({
        id: 'test-product',
        status: PRODUCT_STATUS.AVAILABLE,
        soldLabel: '',
      });
      expect(product.images[0]).toMatchObject({
        id: 'test-product-1',
        thumbnailSrc: '/images/one.jpg',
        position: '50% 50%',
        zoom: 1,
      });
      expect(isProductAvailable(product)).toBe(true);
      expect(Object.isFrozen(product)).toBe(true);
      expect(Object.isFrozen(product.price)).toBe(true);
      expect(Object.isFrozen(product.images)).toBe(true);
      expect(Object.isFrozen(product.images[0])).toBe(true);
    });

    it('models a sold product without a price', () => {
      const product = createProduct(
        createDefinition({
          status: PRODUCT_STATUS.SOLD,
          price: null,
          soldLabel: 'Продана на аукционе',
        }),
      );

      expect(product.price).toBeNull();
      expect(isProductAvailable(product)).toBe(false);
    });

    it.each([
      ['an unstable id', { id: 'Invalid id' }, 'product id must be a stable slug'],
      ['an empty title', { title: '   ' }, 'title is required'],
      ['an unsupported status', { status: 'archived' }, 'unsupported status'],
      ['fewer than two images', { images: [{ src: '/one.jpg', alt: 'One' }] }, 'gallery'],
      [
        'a non-positive current price',
        { price: { current: 0, previous: null, currency: 'USD' } },
        'current price',
      ],
      [
        'a previous price below the current price',
        { price: { current: 2_000, previous: 1_000, currency: 'USD' } },
        'previous price',
      ],
    ])('rejects %s', (_caseName, override, expectedMessage) => {
      expect(() => createProduct(createDefinition(override))).toThrow(expectedMessage);
    });
  });

  describe('catalog search', () => {
    const catalog = [
      { id: 'venus', title: 'Рождение Венеры' },
      { id: 'adam', title: 'Сотворение Адама' },
    ];

    it('matches a trimmed query without case sensitivity', () => {
      expect(filterProductsByTitle(catalog, '  вЕнЕрЫ ')).toEqual([catalog[0]]);
    });

    it('returns the original catalog reference for an empty query', () => {
      expect(filterProductsByTitle(catalog, '   ')).toBe(catalog);
    });

    it.each([
      [0, '0 позиций'],
      [1, '1 позиция'],
      [2, '2 позиции'],
      [5, '5 позиций'],
      [11, '11 позиций'],
      [21, '21 позиция'],
      [24, '24 позиции'],
    ])('uses the correct Russian form for %i results', (count, expected) => {
      expect(getSearchResultLabel('картина', count)).toBe(expected);
    });

    it('does not render a count until a query is entered', () => {
      expect(getSearchResultLabel('  ', 4)).toBe('');
    });
  });
});
