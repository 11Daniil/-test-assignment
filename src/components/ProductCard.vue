<template>
  <article class="product-card" :class="{ 'product-card--sold': isSold }">
    <button
      class="product-card__image-button"
      type="button"
      :aria-label="`Открыть карточку: ${product.title}`"
      @click="selectProduct"
    >
      <img
        v-if="!imageFailed"
        class="product-card__image"
        :src="primaryImage.thumbnailSrc"
        :alt="`${product.title}, ${product.author}`"
        width="280"
        height="160"
        loading="lazy"
        decoding="async"
        @error="imageFailed = true"
      />
      <span
        v-else
        class="product-card__image-placeholder"
        role="img"
        :aria-label="`Изображение картины «${product.title}» временно недоступно`"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 5h16v14H4zM4 16l4.5-4.5 3 3L14 12l6 5" />
          <circle cx="15.5" cy="8.5" r="1.5" />
        </svg>
        <span>Изображение недоступно</span>
      </span>
    </button>

    <div class="product-card__body">
      <button class="product-card__title" type="button" @click="selectProduct">
        <span>«{{ product.title }}»</span>
        <span>{{ product.author }}</span>
      </button>

      <div class="product-card__purchase-row">
        <ProductPrice :product="product" variant="card" />
        <PurchaseButton
          v-if="isAvailable"
          :state="purchaseState"
          variant="compact"
          @purchase="requestPurchase"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { isProductAvailable, PRODUCT_STATUS } from '../utils/catalog';
import { isPurchaseState, PURCHASE_STATE } from '../utils/purchase';
import ProductPrice from './ui/ProductPrice.vue';
import PurchaseButton from './ui/PurchaseButton.vue';

export default {
  name: 'ProductCard',
  components: {
    ProductPrice,
    PurchaseButton,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    purchaseState: {
      type: String,
      default: PURCHASE_STATE.IDLE,
      validator: isPurchaseState,
    },
  },
  data() {
    return {
      imageFailed: false,
    };
  },
  computed: {
    primaryImage() {
      return this.product.images[0];
    },
    isAvailable() {
      return isProductAvailable(this.product);
    },
    isSold() {
      return this.product.status === PRODUCT_STATUS.SOLD;
    },
  },
  watch: {
    'primaryImage.src'() {
      this.imageFailed = false;
    },
  },
  methods: {
    selectProduct() {
      this.$emit('select-product', this.product.id);
    },
    requestPurchase() {
      this.$emit('purchase-request', this.product.id);
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

.product-card__image,
.product-card__image-placeholder {
  width: 100%;
  height: 160px;
}

.product-card__image {
  object-fit: cover;
  transition: transform 300ms ease;
}

.product-card__image-button:hover .product-card__image {
  transform: scale(1.025);
}

.product-card__image-placeholder {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  color: #766e6a;
  background: #e8e3e0;
  font-size: 11px;
}

.product-card__image-placeholder svg {
  width: 30px;
  height: 30px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
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
  .product-card__image,
  .product-card__image-placeholder {
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
