<template>
  <div v-if="isAvailable" class="product-price" :class="`product-price--${variant}`">
    <span v-if="previousPrice" class="product-price__previous">{{ previousPrice }}</span>
    <strong class="product-price__current">{{ currentPrice }}</strong>
  </div>
  <p v-else class="product-price product-price--sold" :class="`product-price--${variant}`">
    {{ product.soldLabel }}
  </p>
</template>

<script>
import { formatMoney, isProductAvailable } from '../../domain/product';

const PRICE_VARIANTS = ['card', 'modal'];

export default {
  name: 'ProductPrice',
  props: {
    product: {
      type: Object,
      required: true,
    },
    variant: {
      type: String,
      default: 'card',
      validator: (value) => PRICE_VARIANTS.includes(value),
    },
  },
  computed: {
    isAvailable() {
      return isProductAvailable(this.product);
    },
    currentPrice() {
      return this.isAvailable
        ? formatMoney(this.product.price.current, this.product.price.currency)
        : '';
    },
    previousPrice() {
      if (!this.isAvailable || !this.product.price.previous) {
        return '';
      }

      return formatMoney(this.product.price.previous, this.product.price.currency);
    },
  },
};
</script>

<style scoped>
.product-price {
  display: flex;
  flex-direction: column;
}

.product-price--card {
  min-width: 92px;
  min-height: 44px;
  justify-content: flex-end;
  white-space: nowrap;
}

.product-price__previous {
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 300;
  line-height: 19px;
  text-decoration: line-through;
}

.product-price--card .product-price__current {
  font-size: 16px;
  line-height: 24px;
}

.product-price--modal {
  min-height: 72px;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 28px;
}

.product-price--modal .product-price__previous {
  line-height: 21px;
}

.product-price--modal .product-price__current {
  font-size: 20px;
  line-height: 30px;
}

.product-price--sold {
  margin-bottom: 0;
  color: #665f5b;
  font-weight: 700;
}

.product-price--sold.product-price--card {
  align-self: center;
  margin-top: 0;
  font-size: 14px;
  line-height: 21px;
  white-space: normal;
}

.product-price--sold.product-price--modal {
  margin-top: auto;
  padding-top: 32px;
}
</style>
