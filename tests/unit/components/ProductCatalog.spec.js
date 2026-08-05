import { shallowMount } from '@vue/test-utils';
import { products } from '../../../src/data/products';
import { PURCHASE_PROCESSING_DELAY_MS, PURCHASE_STATE } from '../../../src/domain/purchase';

const mockCartLoad = jest.fn();
const mockCartSave = jest.fn();

jest.mock('../../../src/repositories/cartRepository', () => {
  const actualRepository = jest.requireActual('../../../src/repositories/cartRepository');

  return {
    ...actualRepository,
    cartRepository: {
      load: mockCartLoad,
      save: mockCartSave,
    },
  };
});

const ProductCatalog = require('../../../src/components/catalog/ProductCatalog.vue').default;

describe('ProductCatalog purchase flow', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
    mockCartLoad.mockReturnValue({
      status: 'loaded',
      productIds: [],
      needsMigration: false,
    });
    mockCartSave.mockReturnValue(true);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
      wrapper = null;
    }
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('moves an available product through processing to a persisted cart state once', () => {
    wrapper = shallowMount(ProductCatalog, { propsData: { query: '' } });

    expect(mockCartLoad).toHaveBeenCalledWith(products.map((product) => product.id));
    expect(mockCartSave).not.toHaveBeenCalled();

    wrapper.vm.requestPurchase('venus');
    wrapper.vm.requestPurchase('venus');

    expect(wrapper.vm.getPurchaseState('venus')).toBe(PURCHASE_STATE.PROCESSING);
    expect(wrapper.vm.liveMessage).toContain('покупка обрабатывается');
    expect(jest.getTimerCount()).toBe(1);
    expect(mockCartSave).not.toHaveBeenCalled();

    jest.advanceTimersByTime(PURCHASE_PROCESSING_DELAY_MS - 1);
    expect(wrapper.vm.getPurchaseState('venus')).toBe(PURCHASE_STATE.PROCESSING);

    jest.advanceTimersByTime(1);

    expect(wrapper.vm.getPurchaseState('venus')).toBe(PURCHASE_STATE.IN_CART);
    expect(wrapper.vm.liveMessage).toContain('добавлено в корзину');
    expect(mockCartSave).toHaveBeenCalledTimes(1);
    expect(mockCartSave).toHaveBeenCalledWith(['venus']);
  });

  it('ignores sold and unknown products and cancels pending work on teardown', () => {
    wrapper = shallowMount(ProductCatalog);

    wrapper.vm.requestPurchase('anatomy-lesson');
    wrapper.vm.requestPurchase('missing-product');

    expect(wrapper.vm.getPurchaseState('anatomy-lesson')).toBe(PURCHASE_STATE.IDLE);
    expect(jest.getTimerCount()).toBe(0);

    wrapper.vm.requestPurchase('venus');
    expect(jest.getTimerCount()).toBe(1);

    wrapper.destroy();
    wrapper = null;

    expect(jest.getTimerCount()).toBe(0);
    jest.advanceTimersByTime(PURCHASE_PROCESSING_DELAY_MS);
    expect(mockCartSave).not.toHaveBeenCalled();
  });
});
