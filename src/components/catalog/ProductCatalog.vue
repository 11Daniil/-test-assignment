<template>
  <div class="product-catalog">
    <ProductGrid
      :products="filteredProducts"
      :purchase-states="purchaseStates"
      :result-label="resultLabel"
      @select-product="selectProduct"
      @purchase-request="requestPurchase"
      @clear-search="$emit('clear-search')"
    />

    <ProductDetailsModal
      v-if="selectedProduct"
      :key="selectedProduct.id"
      :product="selectedProduct"
      :purchase-state="getPurchaseState(selectedProduct.id)"
      @close="closeProduct"
      @purchase-request="requestPurchase"
    />

    <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>
  </div>
</template>

<script>
import { DEFAULT_CART_PRODUCT_IDS, products } from '../../data/products';
import {
  filterProductsByTitle,
  getSearchResultLabel,
  isProductAvailable,
} from '../../utils/catalog';
import {
  createPurchaseStates,
  getCartIds,
  PURCHASE_DELAY,
  PURCHASE_STATE,
} from '../../utils/purchase';
import { loadCart, saveCart } from '../../utils/cartStorage';
import ProductDetailsModal from '../product/ProductDetailsModal.vue';
import ProductGrid from './ProductGrid.vue';

export default {
  name: 'ProductCatalog',
  components: {
    ProductGrid,
    ProductDetailsModal,
  },
  props: {
    query: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      purchaseStates: {},
      selectedProductId: null,
      liveMessage: '',
    };
  },
  computed: {
    filteredProducts() {
      return filterProductsByTitle(products, this.query);
    },
    resultLabel() {
      return getSearchResultLabel(this.query, this.filteredProducts.length);
    },
    selectedProduct() {
      return products.find((product) => product.id === this.selectedProductId) || null;
    },
  },
  created() {
    this.purchaseTimers = new Map();
    this.loadPurchaseStates();
  },
  beforeDestroy() {
    this.purchaseTimers.forEach((timerId) => clearTimeout(timerId));
    this.purchaseTimers.clear();
  },
  methods: {
    loadPurchaseStates() {
      const productIds = products.map((product) => product.id);
      const savedCart = loadCart(productIds);

      this.purchaseStates = createPurchaseStates(
        products,
        savedCart === null ? DEFAULT_CART_PRODUCT_IDS : savedCart,
      );
    },
    getPurchaseState(productId) {
      return this.purchaseStates[productId] || PURCHASE_STATE.IDLE;
    },
    selectProduct(productId) {
      this.selectedProductId = productId;
    },
    closeProduct() {
      this.selectedProductId = null;
    },
    requestPurchase(productId) {
      const product = products.find((item) => item.id === productId);

      if (
        !product ||
        !isProductAvailable(product) ||
        this.getPurchaseState(productId) !== PURCHASE_STATE.IDLE ||
        this.purchaseTimers.has(productId)
      ) {
        return;
      }

      this.$set(this.purchaseStates, productId, PURCHASE_STATE.PROCESSING);
      this.liveMessage = `${product.title}: покупка обрабатывается`;

      const timerId = setTimeout(() => {
        this.purchaseTimers.delete(productId);
        this.completePurchase(productId);
      }, PURCHASE_DELAY);

      this.purchaseTimers.set(productId, timerId);
    },
    completePurchase(productId) {
      if (this.getPurchaseState(productId) !== PURCHASE_STATE.PROCESSING) {
        return;
      }

      const product = products.find((item) => item.id === productId);
      this.$set(this.purchaseStates, productId, PURCHASE_STATE.IN_CART);
      this.persistCart();

      if (product) {
        this.liveMessage = `${product.title}: добавлено в корзину`;
      }
    },
    persistCart() {
      return saveCart(getCartIds(products, this.purchaseStates));
    },
  },
};
</script>

<style scoped>
.product-catalog {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}
</style>
