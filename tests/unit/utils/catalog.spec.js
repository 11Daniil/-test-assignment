import {
  filterProductsByTitle,
  formatPrice,
  getSearchResultLabel,
} from '../../../src/utils/catalog';

const products = [
  { id: 'venus', title: 'Рождение Венеры' },
  { id: 'adam', title: 'Сотворение Адама' },
];

describe('catalog utils', () => {
  it('filters products by title', () => {
    expect(filterProductsByTitle(products, '  вЕнЕрЫ ')).toEqual([products[0]]);
  });

  it('returns all products for an empty query', () => {
    expect(filterProductsByTitle(products, '   ')).toBe(products);
  });

  it.each([
    [1, '1 позиция'],
    [2, '2 позиции'],
    [5, '5 позиций'],
    [11, '11 позиций'],
    [21, '21 позиция'],
  ])('formats the result count: %s', (count, expected) => {
    expect(getSearchResultLabel('картина', count)).toBe(expected);
  });

  it('hides the result count without a query', () => {
    expect(getSearchResultLabel('', 4)).toBe('');
  });

  it('formats prices', () => {
    expect(formatPrice(1_000_000, 'USD')).toContain('1 000 000');
  });
});
