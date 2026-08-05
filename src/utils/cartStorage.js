export const CART_STORAGE_KEY = 'banki-shop-cart-v1';

const isStableId = (value) =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

const normalizeCartIds = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter(isStableId))];
};

const getStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

export const readCart = () => {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const storedValue = storage.getItem(CART_STORAGE_KEY);
    return storedValue === null ? [] : normalizeCartIds(JSON.parse(storedValue));
  } catch {
    return [];
  }
};

export const writeCart = (ids) => {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCartIds(ids)));
    return true;
  } catch {
    return false;
  }
};

export const loadCartIds = readCart;
export const saveCartIds = writeCart;
