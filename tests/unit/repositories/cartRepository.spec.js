import {
  CART_LOAD_STATUS,
  CART_SCHEMA_VERSION,
  CART_STORAGE_KEY,
  createCartRepository,
  LEGACY_CART_STORAGE_KEY,
  normalizeCartProductIds,
  parseCartPayload,
} from '../../../src/repositories/cartRepository';

const createMemoryStorage = (initialValues = {}) => {
  const values = new Map(Object.entries(initialValues));

  return {
    values,
    getItem: jest.fn((key) => (values.has(key) ? values.get(key) : null)),
    setItem: jest.fn((key, value) => values.set(key, String(value))),
  };
};

describe('cart repository', () => {
  it('normalizes stable, unique, known product ids without changing their order', () => {
    expect(
      normalizeCartProductIds(
        ['venus', 'Invalid id', 'adam', 'venus', 42, 'unknown-product'],
        ['venus', 'adam'],
      ),
    ).toEqual(['venus', 'adam']);
    expect(normalizeCartProductIds('venus')).toEqual([]);
  });

  it('parses the current schema and filters ids against the current catalog', () => {
    expect(
      parseCartPayload(
        JSON.stringify({
          version: CART_SCHEMA_VERSION,
          productIds: ['venus', 'removed-product', 'venus'],
        }),
        ['venus'],
      ),
    ).toEqual({
      status: CART_LOAD_STATUS.LOADED,
      productIds: ['venus'],
      needsMigration: false,
    });
  });

  it('recognizes the legacy array payload and marks it for migration', () => {
    expect(parseCartPayload(JSON.stringify(['venus', 'adam']))).toEqual({
      status: CART_LOAD_STATUS.LOADED,
      productIds: ['venus', 'adam'],
      needsMigration: true,
    });
  });

  it.each(['not-json', '{}', '{"version":99,"productIds":["venus"]}'])(
    'recovers from an invalid payload: %s',
    (rawValue) => {
      expect(parseCartPayload(rawValue)).toEqual({
        status: CART_LOAD_STATUS.INVALID,
        productIds: [],
        needsMigration: false,
      });
    },
  );

  it('loads the current schema before considering legacy storage', () => {
    const storage = createMemoryStorage({
      [CART_STORAGE_KEY]: JSON.stringify({
        version: CART_SCHEMA_VERSION,
        productIds: ['venus'],
      }),
      [LEGACY_CART_STORAGE_KEY]: JSON.stringify(['adam']),
    });
    const repository = createCartRepository({ getStorage: () => storage });

    expect(repository.load(['venus', 'adam'])).toEqual({
      status: CART_LOAD_STATUS.LOADED,
      productIds: ['venus'],
      needsMigration: false,
    });
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(storage.getItem).toHaveBeenCalledWith(CART_STORAGE_KEY);
  });

  it('loads a legacy key when the current key is missing', () => {
    const storage = createMemoryStorage({
      [LEGACY_CART_STORAGE_KEY]: JSON.stringify(['adam']),
    });
    const repository = createCartRepository({ getStorage: () => storage });

    expect(repository.load(['venus', 'adam'])).toEqual({
      status: CART_LOAD_STATUS.LOADED,
      productIds: ['adam'],
      needsMigration: true,
    });
  });

  it('distinguishes missing storage state from unavailable storage', () => {
    const missingRepository = createCartRepository({
      getStorage: () => createMemoryStorage(),
    });
    const unavailableRepository = createCartRepository({ getStorage: () => null });

    expect(missingRepository.load()).toEqual({
      status: CART_LOAD_STATUS.MISSING,
      productIds: [],
      needsMigration: false,
    });
    expect(unavailableRepository.load()).toEqual({
      status: CART_LOAD_STATUS.UNAVAILABLE,
      productIds: [],
      needsMigration: false,
    });
  });

  it('treats storage read failures as unavailable state', () => {
    const storage = createMemoryStorage();
    storage.getItem.mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const repository = createCartRepository({ getStorage: () => storage });

    expect(repository.load()).toEqual({
      status: CART_LOAD_STATUS.UNAVAILABLE,
      productIds: [],
      needsMigration: false,
    });
  });

  it('writes a versioned, normalized payload and reports write failures', () => {
    const storage = createMemoryStorage();
    const repository = createCartRepository({ getStorage: () => storage });

    expect(repository.save(['venus', 'Invalid id', 'venus', 'adam'])).toBe(true);
    expect(JSON.parse(storage.values.get(CART_STORAGE_KEY))).toEqual({
      version: CART_SCHEMA_VERSION,
      productIds: ['venus', 'adam'],
    });

    storage.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(repository.save(['venus'])).toBe(false);
  });
});
