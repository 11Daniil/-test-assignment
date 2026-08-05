export const CART_STORAGE_KEY = 'banki-shop-cart';

const uniqueKnownIds = (ids, validIds) => {
  if (!Array.isArray(ids)) {
    return [];
  }

  const knownIds = new Set(validIds);
  return [...new Set(ids.filter((id) => knownIds.has(id)))];
};

export const loadCart = (validIds, storage) => {
  try {
    const cartStorage = storage === undefined ? window.localStorage : storage;

    if (!cartStorage) {
      return null;
    }

    const rawValue = cartStorage.getItem(CART_STORAGE_KEY);

    if (rawValue === null) {
      return null;
    }

    const savedIds = JSON.parse(rawValue);

    if (!Array.isArray(savedIds)) {
      return null;
    }

    return uniqueKnownIds(savedIds, validIds);
  } catch {
    return null;
  }
};

export const saveCart = (productIds, storage) => {
  try {
    const cartStorage = storage === undefined ? window.localStorage : storage;

    if (!cartStorage) {
      return false;
    }

    cartStorage.setItem(CART_STORAGE_KEY, JSON.stringify([...new Set(productIds)]));
    return true;
  } catch {
    return false;
  }
};
