export const PURCHASE_STATE = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  IN_CART: 'in-cart',
};

export const PURCHASE_DELAY = 2000;

const labels = {
  [PURCHASE_STATE.IDLE]: 'Купить',
  [PURCHASE_STATE.PROCESSING]: 'Обрабатывается',
  [PURCHASE_STATE.IN_CART]: 'В корзине',
};

export const isPurchaseState = (state) => Object.values(PURCHASE_STATE).includes(state);

export const getPurchaseStateLabel = (state) => labels[state] || labels[PURCHASE_STATE.IDLE];

export const createPurchaseStates = (products, cartIds) => {
  const cart = new Set(cartIds);

  return products.reduce((states, product) => {
    states[product.id] = cart.has(product.id) ? PURCHASE_STATE.IN_CART : PURCHASE_STATE.IDLE;
    return states;
  }, {});
};

export const getCartIds = (products, purchaseStates) =>
  products
    .filter((product) => purchaseStates[product.id] === PURCHASE_STATE.IN_CART)
    .map((product) => product.id);
