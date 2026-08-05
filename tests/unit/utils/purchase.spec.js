import {
  createPurchaseStates,
  getCartIds,
  getPurchaseStateLabel,
  PURCHASE_STATE,
} from '../../../src/utils/purchase';

const products = [{ id: 'venus' }, { id: 'adam' }];

describe('purchase utils', () => {
  it('creates purchase states from saved cart ids', () => {
    expect(createPurchaseStates(products, ['adam'])).toEqual({
      venus: PURCHASE_STATE.IDLE,
      adam: PURCHASE_STATE.IN_CART,
    });
  });

  it('returns ids of products in the cart', () => {
    expect(
      getCartIds(products, {
        venus: PURCHASE_STATE.IN_CART,
        adam: PURCHASE_STATE.IDLE,
      }),
    ).toEqual(['venus']);
  });

  it('returns button labels', () => {
    expect(getPurchaseStateLabel(PURCHASE_STATE.IDLE)).toBe('Купить');
    expect(getPurchaseStateLabel(PURCHASE_STATE.PROCESSING)).toBe('Обрабатывается');
    expect(getPurchaseStateLabel(PURCHASE_STATE.IN_CART)).toBe('В корзине');
  });
});
