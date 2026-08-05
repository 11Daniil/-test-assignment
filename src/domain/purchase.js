export const PURCHASE_STATE = Object.freeze({
  IDLE: 'idle',
  PROCESSING: 'processing',
  IN_CART: 'in-cart',
});

export const PURCHASE_PROCESSING_DELAY_MS = 2000;

const PURCHASE_STATES = Object.values(PURCHASE_STATE);

export const PURCHASE_STATE_LABEL = Object.freeze({
  [PURCHASE_STATE.IDLE]: 'Купить',
  [PURCHASE_STATE.PROCESSING]: 'Обрабатывается',
  [PURCHASE_STATE.IN_CART]: 'В корзине',
});

export const isPurchaseState = (value) => PURCHASE_STATES.includes(value);

export const getPurchaseStateLabel = (state) =>
  PURCHASE_STATE_LABEL[state] || PURCHASE_STATE_LABEL[PURCHASE_STATE.IDLE];

export const createInitialPurchaseStates = (products, cartProductIds) => {
  const cartIds = new Set(cartProductIds);

  return products.reduce((states, product) => {
    states[product.id] = cartIds.has(product.id) ? PURCHASE_STATE.IN_CART : PURCHASE_STATE.IDLE;
    return states;
  }, {});
};

export const collectCartProductIds = (products, purchaseStates) =>
  products
    .filter((product) => purchaseStates[product.id] === PURCHASE_STATE.IN_CART)
    .map((product) => product.id);

export const createPurchaseScheduler = ({
  delayMs = PURCHASE_PROCESSING_DELAY_MS,
  onComplete,
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
}) => {
  if (typeof onComplete !== 'function') {
    throw new TypeError('[purchase] onComplete callback is required');
  }

  const timers = new Map();

  return Object.freeze({
    schedule(productId) {
      if (timers.has(productId)) {
        return false;
      }

      const timerId = setTimeoutFn(() => {
        timers.delete(productId);
        onComplete(productId);
      }, delayMs);

      timers.set(productId, timerId);
      return true;
    },
    cancel(productId) {
      if (!timers.has(productId)) {
        return false;
      }

      clearTimeoutFn(timers.get(productId));
      timers.delete(productId);
      return true;
    },
    cancelAll() {
      timers.forEach((timerId) => clearTimeoutFn(timerId));
      timers.clear();
    },
    has(productId) {
      return timers.has(productId);
    },
  });
};
