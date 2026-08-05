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
} from '../../domain/product';
import {
  collectCartProductIds,
  createInitialPurchaseStates,
  createPurchaseScheduler,
  PURCHASE_STATE,
} from '../../domain/purchase';
import { cartRepository, CART_LOAD_STATUS } from '../../repositories/cartRepository';
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
  beforeCreate() {
    this.purchaseScheduler = null;
  },
  created() {
    this.initializePurchaseState();
    this.purchaseScheduler = createPurchaseScheduler({
      onComplete: this.completePurchase,
    });
  },
  beforeDestroy() {
    if (this.purchaseScheduler) {
      this.purchaseScheduler.cancelAll();
    }
  },
  methods: {
    initializePurchaseState() {
      const productIds = products.map((product) => product.id);
      const storedCart = cartRepository.load(productIds);
      const shouldUseStoredCart = storedCart.status === CART_LOAD_STATUS.LOADED;
      const initialCartIds = shouldUseStoredCart ? storedCart.productIds : DEFAULT_CART_PRODUCT_IDS;

      this.purchaseStates = createInitialPurchaseStates(products, initialCartIds);

      const shouldPersistInitialState =
        storedCart.status === CART_LOAD_STATUS.MISSING ||
        storedCart.status === CART_LOAD_STATUS.INVALID ||
        storedCart.needsMigration;

      if (shouldPersistInitialState) {
        this.persistCart();
      }
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
        !this.purchaseScheduler.schedule(productId)
      ) {
        return;
      }

      this.$set(this.purchaseStates, productId, PURCHASE_STATE.PROCESSING);
      this.liveMessage = `${product.title}: покупка обрабатывается`;
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
      return cartRepository.save(collectCartProductIds(products, this.purchaseStates));
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
