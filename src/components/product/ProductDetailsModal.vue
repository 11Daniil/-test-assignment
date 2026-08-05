<template>
  <BaseModal
    :labelled-by="titleId"
    close-label="Закрыть карточку товара"
    @close="$emit('close')"
    @modal-keydown="handleModalKeydown"
  >
    <div class="product-modal">
      <ProductGallery ref="gallery" :images="product.images" @change="activeImageIndex = $event" />

      <div class="product-modal__details">
        <p class="product-modal__eyebrow">Картина эпохи Возрождения</p>
        <h2 :id="titleId">«{{ product.title }}»</h2>
        <p class="product-modal__author">{{ product.author }}</p>
        <p class="product-modal__description">{{ product.description }}</p>

        <ProductPrice :product="product" variant="modal" />
        <PurchaseButton
          v-if="isAvailable"
          class="product-modal__purchase"
          :state="purchaseState"
          variant="wide"
          @purchase="$emit('purchase-request', product.id)"
        />

        <p class="product-modal__counter" aria-live="polite">
          Изображение {{ activeImageIndex + 1 }} из {{ product.images.length }}
        </p>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { isProductAvailable } from '../../domain/product';
import { isPurchaseState, PURCHASE_STATE } from '../../domain/purchase';
import BaseModal from '../ui/BaseModal.vue';
import ProductPrice from '../ui/ProductPrice.vue';
import PurchaseButton from '../ui/PurchaseButton.vue';
import ProductGallery from './ProductGallery.vue';

export default {
  name: 'ProductDetailsModal',
  components: {
    BaseModal,
    ProductGallery,
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
      activeImageIndex: 0,
    };
  },
  computed: {
    titleId() {
      return `product-modal-title-${this.product.id}`;
    },
    isAvailable() {
      return isProductAvailable(this.product);
    },
  },
  methods: {
    handleModalKeydown(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.$refs.gallery.showPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.$refs.gallery.showNext();
      }
    },
  },
};
</script>

<style scoped>
.product-modal {
  display: grid;
  min-height: 540px;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
}

.product-modal__details {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 72px 44px 38px;
}

.product-modal__eyebrow {
  margin: 0 0 12px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.product-modal__details h2 {
  margin: 0;
  font-size: 24px;
  line-height: 36px;
}

.product-modal__author {
  margin: 2px 0 26px;
  font-size: 18px;
  line-height: 27px;
}

.product-modal__description {
  margin: 0;
  color: #625b58;
  font-size: 14px;
  font-weight: 300;
  line-height: 24px;
}

.product-modal__purchase {
  margin-top: 18px;
}

.product-modal__counter {
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: 11px;
  text-align: center;
}

@media (max-width: 800px) {
  .product-modal {
    min-height: 0;
    grid-template-columns: minmax(0, 1fr);
  }

  .product-modal__details {
    min-height: 390px;
    padding: 36px 32px 30px;
  }
}

@media (max-width: 480px) {
  .product-modal__details {
    min-height: 0;
    padding: 30px 24px 28px;
  }

  .product-modal__details h2 {
    padding-right: 20px;
    font-size: 22px;
    line-height: 31px;
  }

  .product-modal__author {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
