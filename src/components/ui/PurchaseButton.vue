<template>
  <button
    class="purchase-button"
    :class="[`purchase-button--${variant}`, `purchase-button--${state}`]"
    type="button"
    :disabled="isDisabled"
    :aria-busy="state === PURCHASE_STATE.PROCESSING ? 'true' : 'false'"
    @click="$emit('purchase')"
  >
    <svg
      v-if="state === PURCHASE_STATE.PROCESSING"
      class="purchase-button__spinner"
      aria-hidden="true"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
    <svg
      v-else-if="state === PURCHASE_STATE.IN_CART"
      class="purchase-button__check"
      aria-hidden="true"
      viewBox="0 0 24 24"
    >
      <path d="m5 12.5 4.2 4.2L19 7" />
    </svg>
    <span>{{ label }}</span>
  </button>
</template>

<script>
import { getPurchaseStateLabel, isPurchaseState, PURCHASE_STATE } from '../../utils/purchase';

const BUTTON_VARIANTS = ['compact', 'wide'];

export default {
  name: 'PurchaseButton',
  props: {
    state: {
      type: String,
      default: PURCHASE_STATE.IDLE,
      validator: isPurchaseState,
    },
    variant: {
      type: String,
      default: 'compact',
      validator: (value) => BUTTON_VARIANTS.includes(value),
    },
  },
  data() {
    return {
      PURCHASE_STATE,
    };
  },
  computed: {
    label() {
      return getPurchaseStateLabel(this.state);
    },
    isDisabled() {
      return this.state !== PURCHASE_STATE.IDLE;
    },
  },
};
</script>

<style scoped>
.purchase-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--color-action);
  color: #fff;
  background: var(--color-action);
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.purchase-button:hover:not(:disabled) {
  border-color: var(--color-action-hover);
  background: var(--color-action-hover);
}

.purchase-button:disabled {
  cursor: default;
}

.purchase-button--compact {
  width: 118px;
  height: 48px;
  flex: 0 0 118px;
  padding: 0 9px;
  font-size: 14px;
  line-height: 18px;
}

.purchase-button--wide {
  width: 100%;
  height: 52px;
  padding: 0 18px;
  font-size: 14px;
  line-height: 21px;
}

.purchase-button--processing {
  border-color: #7d6963;
  background: #7d6963;
}

.purchase-button--compact.purchase-button--processing {
  font-size: 10px;
}

.purchase-button--in-cart {
  border-color: var(--color-action-soft);
  background: var(--color-action-soft);
}

.purchase-button--compact.purchase-button--in-cart {
  font-size: 13px;
}

.purchase-button svg {
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  fill: none;
  stroke: currentColor;
}

.purchase-button__spinner {
  animation: purchase-button-spin 750ms linear infinite;
  stroke-dasharray: 42 18;
  stroke-linecap: round;
  stroke-width: 2;
}

.purchase-button__check {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

@keyframes purchase-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
