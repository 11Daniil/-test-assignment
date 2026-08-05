import { mount } from '@vue/test-utils';
import PurchaseButton from '../../../src/components/ui/PurchaseButton.vue';
import { PURCHASE_STATE } from '../../../src/domain/purchase';

describe('PurchaseButton', () => {
  it('emits a purchase request from the idle state', async () => {
    const wrapper = mount(PurchaseButton);

    expect(wrapper.text()).toBe('Купить');
    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.attributes('aria-busy')).toBe('false');

    await wrapper.trigger('click');

    expect(wrapper.emitted('purchase')).toHaveLength(1);
    wrapper.destroy();
  });

  it('renders processing and in-cart states as disabled status controls', async () => {
    const wrapper = mount(PurchaseButton, {
      propsData: { state: PURCHASE_STATE.PROCESSING, variant: 'wide' },
    });

    expect(wrapper.text()).toBe('Обрабатывается');
    expect(wrapper.attributes('disabled')).toBe('disabled');
    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.find('.purchase-button__spinner').exists()).toBe(true);
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['purchase-button--wide', 'purchase-button--processing']),
    );

    await wrapper.setProps({ state: PURCHASE_STATE.IN_CART });

    expect(wrapper.text()).toBe('В корзине');
    expect(wrapper.attributes('disabled')).toBe('disabled');
    expect(wrapper.attributes('aria-busy')).toBe('false');
    expect(wrapper.find('.purchase-button__spinner').exists()).toBe(false);
    expect(wrapper.find('.purchase-button__check').exists()).toBe(true);
    expect(wrapper.classes()).toContain('purchase-button--in-cart');
    wrapper.destroy();
  });
});
