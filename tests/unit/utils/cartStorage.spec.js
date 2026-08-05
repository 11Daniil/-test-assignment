import { CART_STORAGE_KEY, loadCart, saveCart } from '../../../src/utils/cartStorage';

const createStorage = (value = null) => ({
  getItem: jest.fn(() => value),
  setItem: jest.fn(),
});

describe('cart storage', () => {
  it('returns null when there is no saved cart', () => {
    expect(loadCart(['venus'], createStorage())).toBeNull();
  });

  it('loads known product ids', () => {
    const storage = createStorage(JSON.stringify(['venus', 'removed', 'venus']));

    expect(loadCart(['venus', 'adam'], storage)).toEqual(['venus']);
  });

  it('ignores invalid data', () => {
    expect(loadCart(['venus'], createStorage('not json'))).toBeNull();
    expect(loadCart(['venus'], createStorage('{}'))).toBeNull();
  });

  it('saves the cart', () => {
    const storage = createStorage();

    expect(saveCart(['venus', 'venus'], storage)).toBe(true);
    expect(storage.setItem).toHaveBeenCalledWith(CART_STORAGE_KEY, JSON.stringify(['venus']));
  });

  it('handles storage errors', () => {
    const storage = createStorage();
    storage.setItem.mockImplementation(() => {
      throw new Error('Storage is unavailable');
    });

    expect(saveCart(['venus'], storage)).toBe(false);
  });
});
