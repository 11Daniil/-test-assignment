import { shallowMount } from '@vue/test-utils';
import { products } from '../../../src/data/products';
import { PURCHASE_DELAY, PURCHASE_STATE } from '../../../src/utils/purchase';

const mockLoadCart = jest.fn();
const mockSaveCart = jest.fn();

jest.mock('../../../src/utils/cartStorage', () => ({
  loadCart: mockLoadCart,
  saveCart: mockSaveCart,
}));

const ProductCatalog = require('../../../src/components/catalog/ProductCatalog.vue').default;

describe('ProductCatalog', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
    mockLoadCart.mockReturnValue([]);
    mockSaveCart.mockReturnValue(true);
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy();
      wrapper = null;
    }
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('adds a product to the cart after two seconds', () => {
    wrapper = shallowMount(ProductCatalog, { propsData: { query: '' } });

    expect(mockLoadCart).toHaveBeenCalledWith(products.map((product) => product.id));

    wrapper.vm.requestPurchase('venus');
    wrapper.vm.requestPurchase('venus');

    expect(wrapper.vm.getPurchaseState('venus')).toBe(PURCHASE_STATE.PROCESSING);
    expect(jest.getTimerCount()).toBe(1);

    jest.advanceTimersByTime(PURCHASE_DELAY);

    expect(wrapper.vm.getPurchaseState('venus')).toBe(PURCHASE_STATE.IN_CART);
    expect(mockSaveCart).toHaveBeenCalledWith(['venus']);
  });

  it('does not buy a sold product', () => {
    wrapper = shallowMount(ProductCatalog);

    wrapper.vm.requestPurchase('anatomy-lesson');

    expect(wrapper.vm.getPurchaseState('anatomy-lesson')).toBe(PURCHASE_STATE.IDLE);
    expect(jest.getTimerCount()).toBe(0);
  });

  it('clears pending timers when destroyed', () => {
    wrapper = shallowMount(ProductCatalog);

    wrapper.vm.requestPurchase('venus');
    expect(jest.getTimerCount()).toBe(1);

    wrapper.destroy();
    wrapper = null;

    expect(jest.getTimerCount()).toBe(0);
    jest.advanceTimersByTime(PURCHASE_DELAY);
    expect(mockSaveCart).not.toHaveBeenCalled();
  });
});
