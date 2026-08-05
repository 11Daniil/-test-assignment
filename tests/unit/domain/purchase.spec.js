import {
  collectCartProductIds,
  createInitialPurchaseStates,
  createPurchaseScheduler,
  getPurchaseStateLabel,
  isPurchaseState,
  PURCHASE_PROCESSING_DELAY_MS,
  PURCHASE_STATE,
} from '../../../src/domain/purchase';

const products = [{ id: 'venus' }, { id: 'adam' }, { id: 'sold-product' }];

describe('purchase domain', () => {
  it('builds purchase state only for catalog products and collects in-cart ids in catalog order', () => {
    const states = createInitialPurchaseStates(products, ['adam', 'unknown-product']);

    expect(states).toEqual({
      venus: PURCHASE_STATE.IDLE,
      adam: PURCHASE_STATE.IN_CART,
      'sold-product': PURCHASE_STATE.IDLE,
    });
    expect(
      collectCartProductIds(products, {
        ...states,
        venus: PURCHASE_STATE.IN_CART,
        'unknown-product': PURCHASE_STATE.IN_CART,
      }),
    ).toEqual(['venus', 'adam']);
  });

  it('exposes a closed set of states with stable user-facing labels', () => {
    expect(Object.values(PURCHASE_STATE).every(isPurchaseState)).toBe(true);
    expect(isPurchaseState('failed')).toBe(false);
    expect(getPurchaseStateLabel(PURCHASE_STATE.IDLE)).toBe('Купить');
    expect(getPurchaseStateLabel(PURCHASE_STATE.PROCESSING)).toBe('Обрабатывается');
    expect(getPurchaseStateLabel(PURCHASE_STATE.IN_CART)).toBe('В корзине');
    expect(getPurchaseStateLabel('unexpected')).toBe('Купить');
  });

  describe('createPurchaseScheduler', () => {
    const createTimerHarness = () => {
      const callbacks = new Map();
      let nextTimerId = 1;
      const setTimeoutFn = jest.fn((callback) => {
        const timerId = nextTimerId;
        nextTimerId += 1;
        callbacks.set(timerId, callback);
        return timerId;
      });
      const clearTimeoutFn = jest.fn((timerId) => callbacks.delete(timerId));

      return { callbacks, setTimeoutFn, clearTimeoutFn };
    };

    it('schedules one completion per product and releases it before invoking the callback', () => {
      const timers = createTimerHarness();
      const onComplete = jest.fn();
      const scheduler = createPurchaseScheduler({
        onComplete,
        setTimeoutFn: timers.setTimeoutFn,
        clearTimeoutFn: timers.clearTimeoutFn,
      });

      expect(scheduler.schedule('venus')).toBe(true);
      expect(scheduler.schedule('venus')).toBe(false);
      expect(scheduler.has('venus')).toBe(true);
      expect(timers.setTimeoutFn).toHaveBeenCalledTimes(1);
      expect(timers.setTimeoutFn).toHaveBeenCalledWith(
        expect.any(Function),
        PURCHASE_PROCESSING_DELAY_MS,
      );

      timers.callbacks.get(1)();

      expect(scheduler.has('venus')).toBe(false);
      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith('venus');
      expect(scheduler.schedule('venus')).toBe(true);
    });

    it('cancels one scheduled purchase without completing it', () => {
      const timers = createTimerHarness();
      const onComplete = jest.fn();
      const scheduler = createPurchaseScheduler({
        delayMs: 25,
        onComplete,
        setTimeoutFn: timers.setTimeoutFn,
        clearTimeoutFn: timers.clearTimeoutFn,
      });

      scheduler.schedule('venus');

      expect(scheduler.cancel('venus')).toBe(true);
      expect(scheduler.cancel('venus')).toBe(false);
      expect(scheduler.has('venus')).toBe(false);
      expect(timers.clearTimeoutFn).toHaveBeenCalledWith(1);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('cancels every timer during owner teardown', () => {
      const timers = createTimerHarness();
      const scheduler = createPurchaseScheduler({
        onComplete: jest.fn(),
        setTimeoutFn: timers.setTimeoutFn,
        clearTimeoutFn: timers.clearTimeoutFn,
      });

      scheduler.schedule('venus');
      scheduler.schedule('adam');
      scheduler.cancelAll();

      expect(timers.clearTimeoutFn).toHaveBeenCalledTimes(2);
      expect(timers.clearTimeoutFn).toHaveBeenCalledWith(1);
      expect(timers.clearTimeoutFn).toHaveBeenCalledWith(2);
      expect(scheduler.has('venus')).toBe(false);
      expect(scheduler.has('adam')).toBe(false);
    });

    it('requires an explicit completion callback', () => {
      expect(() => createPurchaseScheduler({})).toThrow('onComplete callback is required');
    });
  });
});
