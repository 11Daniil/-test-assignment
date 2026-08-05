<template>
  <article class="product-card" :class="{ 'product-card--sold': product.sold }">
    <button
      class="product-card__image-button"
      type="button"
      :aria-label="`Открыть карточку: ${product.title}`"
      @click="$emit('open')"
    >
      <img
        class="product-card__image"
        :src="product.image"
        :alt="`${product.title}, ${product.author}`"
        width="280"
        height="160"
        loading="lazy"
      />
    </button>

    <div class="product-card__body">
      <button class="product-card__title" type="button" @click="$emit('open')">
        <span>«{{ product.title }}»</span>
        <span>{{ product.author }}</span>
      </button>

      <div class="product-card__purchase-row">
        <div v-if="product.available" class="product-card__price">
          <span v-if="product.oldPrice" class="product-card__old-price">
            {{ product.oldPrice }}
          </span>
          <strong>{{ product.price }}</strong>
        </div>
        <p v-else class="product-card__auction">{{ product.auctionText }}</p>

        <button
          v-if="product.available"
          class="purchase-button"
          :class="`purchase-button--${purchaseState}`"
          type="button"
          :disabled="purchaseState !== 'idle'"
          :aria-busy="purchaseState === 'processing' ? 'true' : 'false'"
          @click="$emit('buy')"
        >
          <svg
            v-if="purchaseState === 'processing'"
            class="purchase-button__spinner"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
          <svg
            v-else-if="purchaseState === 'in-cart'"
            class="purchase-button__check"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <path d="m5 12.5 4.2 4.2L19 7" />
          </svg>
          <span>{{ buttonLabel }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
    purchaseState: {
      type: String,
      default: 'idle',
      validator: (value) => ['idle', 'processing', 'in-cart'].includes(value),
    },
  },
  computed: {
    buttonLabel() {
      const labels = {
        idle: 'Купить',
        processing: 'Обрабатывается',
        'in-cart': 'В корзине',
      };

      return labels[this.purchaseState];
    },
  },
};
</script>

<style scoped>
.product-card {
  display: flex;
  width: 280px;
  min-width: 0;
  height: 328px;
  flex-direction: column;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: border-color 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.product-card:hover {
  border-color: #d2cbc7;
  box-shadow: 0 10px 24px rgba(52, 48, 46, 0.08);
}

.product-card--sold {
  opacity: 0.5;
}

.product-card--sold:hover {
  border-color: var(--color-border);
  box-shadow: none;
  opacity: 0.62;
}

.product-card__image-button,
.product-card__title {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.product-card__image-button {
  width: 100%;
  height: 160px;
  flex: 0 0 160px;
  overflow: hidden;
}

.product-card__image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 300ms ease;
}

.product-card__image-button:hover .product-card__image {
  transform: scale(1.025);
}

.product-card__body {
  display: flex;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
  padding: 20px 23px 22px;
}

.product-card__title {
  display: block;
  width: 100%;
  min-height: 58px;
  flex: 0 0 auto;
  text-align: left;
  text-decoration: none;
}

.product-card__title span {
  display: block;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.product-card__title:hover span:first-child {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.product-card__purchase-row {
  display: flex;
  min-height: 48px;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  margin-top: auto;
}

.product-card__price {
  display: flex;
  min-width: 92px;
  min-height: 44px;
  flex-direction: column;
  justify-content: flex-end;
  white-space: nowrap;
}

.product-card__old-price {
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 300;
  line-height: 19px;
  text-decoration: line-through;
}

.product-card__price strong {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.product-card__auction {
  align-self: center;
  margin: 0;
  color: #665f5b;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
}

.purchase-button {
  display: inline-flex;
  width: 118px;
  height: 48px;
  flex: 0 0 118px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 9px;
  border: 1px solid var(--color-action);
  color: #fff;
  background: var(--color-action);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
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

.purchase-button--processing {
  border-color: #7d6963;
  background: #7d6963;
  font-size: 10px;
}

.purchase-button--in-cart {
  border-color: var(--color-action-soft);
  background: var(--color-action-soft);
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
  animation: spin 750ms linear infinite;
  stroke-dasharray: 42 18;
  stroke-linecap: round;
  stroke-width: 2;
}

.purchase-button__check {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1279px) {
  .product-card {
    width: 100%;
  }
}

@media (max-width: 639px) {
  .product-card {
    height: auto;
    min-height: 348px;
  }

  .product-card__image-button,
  .product-card__image {
    height: 187px;
  }

  .product-card__image-button {
    flex-basis: 187px;
  }

  .product-card__body {
    min-height: 160px;
  }
}
</style>
