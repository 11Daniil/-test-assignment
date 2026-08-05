export const CART_STORAGE_KEY = 'banki-shop-cart-v2';
export const LEGACY_CART_STORAGE_KEY = 'banki-shop-cart-v1';
export const CART_SCHEMA_VERSION = 1;

export const CART_LOAD_STATUS = Object.freeze({
  LOADED: 'loaded',
  MISSING: 'missing',
  INVALID: 'invalid',
  UNAVAILABLE: 'unavailable',
});

const STABLE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const normalizeCartProductIds = (value, validProductIds = null) => {
  if (!Array.isArray(value)) {
    return [];
  }

  const validIds = validProductIds ? new Set(validProductIds) : null;

  return [
    ...new Set(
      value.filter(
        (id) =>
          typeof id === 'string' && STABLE_ID_PATTERN.test(id) && (!validIds || validIds.has(id)),
      ),
    ),
  ];
};

export const parseCartPayload = (rawValue, validProductIds = null) => {
  try {
    const parsedValue = JSON.parse(rawValue);

    if (Array.isArray(parsedValue)) {
      return {
        status: CART_LOAD_STATUS.LOADED,
        productIds: normalizeCartProductIds(parsedValue, validProductIds),
        needsMigration: true,
      };
    }

    if (
      parsedValue &&
      parsedValue.version === CART_SCHEMA_VERSION &&
      Array.isArray(parsedValue.productIds)
    ) {
      return {
        status: CART_LOAD_STATUS.LOADED,
        productIds: normalizeCartProductIds(parsedValue.productIds, validProductIds),
        needsMigration: false,
      };
    }
  } catch {
    // Invalid user storage is treated as recoverable application state.
  }

  return {
    status: CART_LOAD_STATUS.INVALID,
    productIds: [],
    needsMigration: false,
  };
};

const resolveBrowserStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const createCartRepository = ({ getStorage = resolveBrowserStorage } = {}) => ({
  load(validProductIds = null) {
    const storage = getStorage();

    if (!storage) {
      return {
        status: CART_LOAD_STATUS.UNAVAILABLE,
        productIds: [],
        needsMigration: false,
      };
    }

    try {
      const currentValue = storage.getItem(CART_STORAGE_KEY);

      if (currentValue !== null) {
        return parseCartPayload(currentValue, validProductIds);
      }

      const legacyValue = storage.getItem(LEGACY_CART_STORAGE_KEY);

      if (legacyValue !== null) {
        return parseCartPayload(legacyValue, validProductIds);
      }

      return {
        status: CART_LOAD_STATUS.MISSING,
        productIds: [],
        needsMigration: false,
      };
    } catch {
      return {
        status: CART_LOAD_STATUS.UNAVAILABLE,
        productIds: [],
        needsMigration: false,
      };
    }
  },
  save(productIds) {
    const storage = getStorage();

    if (!storage) {
      return false;
    }

    try {
      storage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          version: CART_SCHEMA_VERSION,
          productIds: normalizeCartProductIds(productIds),
        }),
      );
      return true;
    } catch {
      return false;
    }
  },
});

export const cartRepository = createCartRepository();
