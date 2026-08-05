<template>
  <main id="catalog" class="catalog-main">
    <div class="container">
      <div class="catalog-heading">
        <h1>Картины эпохи Возрождения</h1>
        <p class="catalog-count" aria-live="polite">{{ resultLabel }}</p>
      </div>

      <div v-if="products.length" class="product-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :purchase-state="getPurchaseState(product.id)"
          @select-product="$emit('select-product', $event)"
          @purchase-request="$emit('purchase-request', $event)"
        />
      </div>

      <div v-else class="empty-state" role="status">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m16.2 16.2 4 4" />
        </svg>
        <h2>Картины не найдены</h2>
        <p>Попробуйте изменить запрос или очистить строку поиска.</p>
        <button type="button" @click="$emit('clear-search')">Показать все</button>
      </div>
    </div>
  </main>
</template>

<script>
import { PURCHASE_STATE } from '../../domain/purchase';
import ProductCard from '../ProductCard.vue';

export default {
  name: 'ProductGrid',
  components: {
    ProductCard,
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    purchaseStates: {
      type: Object,
      required: true,
    },
    resultLabel: {
      type: String,
      default: '',
    },
  },
  methods: {
    getPurchaseState(productId) {
      return this.purchaseStates[productId] || PURCHASE_STATE.IDLE;
    },
  },
};
</script>

<style scoped>
.catalog-main {
  flex: 1 0 auto;
  padding: 48px 0 72px;
}

.catalog-heading {
  display: flex;
  min-height: 36px;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 32px;
}

.catalog-heading h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
}

.catalog-count {
  margin: 0;
  color: var(--color-muted);
  font-size: 12px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 280px);
  gap: 32px;
}

.empty-state {
  display: grid;
  min-height: 328px;
  place-items: center;
  align-content: center;
  border: 1px solid var(--color-border);
  text-align: center;
}

.empty-state svg {
  width: 40px;
  height: 40px;
  margin-bottom: 18px;
  fill: none;
  stroke: var(--color-muted);
  stroke-linecap: round;
  stroke-width: 1.5;
}

.empty-state h2 {
  margin: 0 0 8px;
  font-size: 18px;
  line-height: 27px;
}

.empty-state p {
  margin: 0 0 20px;
  color: var(--color-muted);
}

.empty-state button {
  min-width: 132px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  color: #fff;
  background: var(--color-action);
  cursor: pointer;
  font-weight: 700;
}

@media (max-width: 1279px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 959px) {
  .catalog-main {
    padding-top: 40px;
  }

  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }
}

@media (max-width: 639px) {
  .catalog-main {
    padding: 32px 0 48px;
  }

  .catalog-heading {
    display: block;
    margin-bottom: 24px;
  }

  .catalog-heading h1 {
    font-size: 22px;
    line-height: 31px;
  }

  .catalog-count {
    min-height: 18px;
    margin-top: 4px;
  }

  .product-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
}
</style>
