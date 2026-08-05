<template>
  <div class="modal" role="presentation" @mousedown.self="$emit('close')">
    <section
      ref="dialog"
      class="modal__dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${product.id}`"
    >
      <button
        ref="closeButton"
        class="modal__close"
        type="button"
        aria-label="Закрыть карточку товара"
        @click="$emit('close')"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 5 19 19M19 5 5 19" />
        </svg>
      </button>

      <div class="modal__gallery" aria-label="Галерея товара">
        <div class="modal__viewport">
          <img
            :key="currentSlide.id"
            :src="currentSlide.src"
            :alt="currentSlide.alt"
            :style="currentImageStyle"
          />

          <button
            class="modal__arrow modal__arrow--previous"
            type="button"
            aria-label="Предыдущее изображение"
            @click="showPrevious"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m15 5-7 7 7 7" />
            </svg>
          </button>
          <button
            class="modal__arrow modal__arrow--next"
            type="button"
            aria-label="Следующее изображение"
            @click="showNext"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="modal__dots" aria-label="Выбор изображения">
          <button
            v-for="(slide, index) in product.slides"
            :key="slide.id"
            type="button"
            :class="{ 'is-active': index === currentIndex }"
            :aria-label="`Показать изображение ${index + 1}`"
            :aria-current="index === currentIndex ? 'true' : null"
            @click="currentIndex = index"
          />
        </div>
      </div>

      <div class="modal__details">
        <p class="modal__eyebrow">Картина эпохи Возрождения</p>
        <h2 :id="`modal-title-${product.id}`">«{{ product.title }}»</h2>
        <p class="modal__author">{{ product.author }}</p>
        <p class="modal__description">{{ product.description }}</p>

        <div v-if="product.available" class="modal__price-block">
          <span v-if="product.oldPrice" class="modal__old-price">
            {{ product.oldPrice }}
          </span>
          <strong>{{ product.price }}</strong>
        </div>
        <p v-else class="modal__auction">{{ product.auctionText }}</p>

        <button
          v-if="product.available"
          class="modal__purchase"
          :class="`modal__purchase--${purchaseState}`"
          type="button"
          :disabled="purchaseState !== 'idle'"
          :aria-busy="purchaseState === 'processing' ? 'true' : 'false'"
          @click="$emit('buy')"
        >
          <svg
            v-if="purchaseState === 'processing'"
            class="modal__spinner"
            aria-hidden="true"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
          <svg v-else-if="purchaseState === 'in-cart'" aria-hidden="true" viewBox="0 0 24 24">
            <path d="m5 12.5 4.2 4.2L19 7" />
          </svg>
          <span>{{ purchaseLabel }}</span>
        </button>

        <p class="modal__counter" aria-live="polite">
          Изображение {{ currentIndex + 1 }} из {{ product.slides.length }}
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ProductModal',
  props: {
    product: {
      type: Object,
      required: true,
    },
    purchaseState: {
      type: String,
      default: 'idle',
    },
  },
  data() {
    return {
      currentIndex: 0,
      previousActiveElement: null,
      previousBodyOverflow: '',
    };
  },
  computed: {
    currentSlide() {
      return this.product.slides[this.currentIndex];
    },
    currentImageStyle() {
      return {
        objectPosition: this.currentSlide.position,
        transform: `scale(${this.currentSlide.zoom})`,
        transformOrigin: this.currentSlide.position,
      };
    },
    purchaseLabel() {
      return {
        idle: 'Купить',
        processing: 'Обрабатывается',
        'in-cart': 'В корзине',
      }[this.purchaseState];
    },
  },
  mounted() {
    this.previousActiveElement = document.activeElement;
    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', this.handleKeydown);

    this.$nextTick(() => {
      this.$refs.closeButton.focus();
    });
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = this.previousBodyOverflow;

    if (
      this.previousActiveElement &&
      typeof this.previousActiveElement.focus === 'function' &&
      document.contains(this.previousActiveElement)
    ) {
      this.previousActiveElement.focus();
    }
  },
  methods: {
    showPrevious() {
      const lastIndex = this.product.slides.length - 1;
      this.currentIndex = this.currentIndex === 0 ? lastIndex : this.currentIndex - 1;
    },
    showNext() {
      this.currentIndex = (this.currentIndex + 1) % this.product.slides.length;
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.$emit('close');
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        this.showPrevious();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        this.showNext();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = Array.from(
        this.$refs.dialog.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (!this.$refs.dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  overflow-y: auto;
  place-items: center;
  padding: 32px;
  background: rgba(31, 25, 23, 0.74);
}

.modal__dialog {
  position: relative;
  display: grid;
  width: 100%;
  max-width: 940px;
  min-height: 540px;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: var(--color-surface);
  box-shadow: 0 28px 80px rgba(20, 15, 13, 0.3);
}

.modal__close {
  position: absolute;
  z-index: 4;
  top: 20px;
  right: 20px;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: rgba(248, 246, 245, 0.94);
  cursor: pointer;
}

.modal__close svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.6;
}

.modal__gallery {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  background: #28211f;
}

.modal__viewport {
  position: relative;
  min-height: 500px;
  flex: 1 1 auto;
  overflow: hidden;
}

.modal__viewport img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: image-reveal 280ms ease;
}

.modal__arrow {
  position: absolute;
  top: 50%;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.66);
  border-radius: 50%;
  color: #fff;
  background: rgba(40, 33, 31, 0.55);
  cursor: pointer;
  transform: translateY(-50%);
}

.modal__arrow:hover {
  background: rgba(40, 33, 31, 0.86);
}

.modal__arrow--previous {
  left: 20px;
}

.modal__arrow--next {
  right: 20px;
}

.modal__arrow svg {
  width: 23px;
  height: 23px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.modal__dots {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 25px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal__dots button {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 1px solid #fff;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.modal__dots button.is-active {
  background: #fff;
}

.modal__details {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 72px 44px 38px;
}

.modal__eyebrow {
  margin: 0 0 12px;
  color: var(--color-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.modal__details h2 {
  margin: 0;
  font-size: 24px;
  line-height: 36px;
}

.modal__author {
  margin: 2px 0 26px;
  font-size: 18px;
  line-height: 27px;
}

.modal__description {
  margin: 0;
  color: #625b58;
  font-size: 14px;
  font-weight: 300;
  line-height: 24px;
}

.modal__price-block {
  display: flex;
  min-height: 72px;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 28px;
}

.modal__old-price {
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  text-decoration: line-through;
}

.modal__price-block strong {
  font-size: 20px;
  line-height: 30px;
}

.modal__auction {
  margin: auto 0 0;
  padding-top: 32px;
  font-weight: 700;
}

.modal__purchase {
  display: flex;
  width: 100%;
  height: 52px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  border: 1px solid var(--color-action);
  color: #fff;
  background: var(--color-action);
  cursor: pointer;
  font-weight: 700;
}

.modal__purchase:hover:not(:disabled) {
  border-color: var(--color-action-hover);
  background: var(--color-action-hover);
}

.modal__purchase:disabled {
  cursor: default;
}

.modal__purchase--processing {
  border-color: #7d6963;
  background: #7d6963;
}

.modal__purchase--in-cart {
  border-color: var(--color-action-soft);
  background: var(--color-action-soft);
}

.modal__purchase svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.modal__spinner {
  animation: spin 750ms linear infinite;
  stroke-dasharray: 42 18;
}

.modal__counter {
  margin: 16px 0 0;
  color: var(--color-muted);
  font-size: 11px;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes image-reveal {
  from {
    filter: brightness(0.82);
    opacity: 0.75;
  }

  to {
    filter: brightness(1);
    opacity: 1;
  }
}

@media (max-width: 800px) {
  .modal {
    display: block;
    padding: 20px;
  }

  .modal__dialog {
    max-width: 620px;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr);
    margin: 0 auto;
  }

  .modal__viewport {
    min-height: 330px;
    aspect-ratio: 16 / 10;
  }

  .modal__details {
    min-height: 390px;
    padding: 36px 32px 30px;
  }

  .modal__close {
    top: 16px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .modal {
    padding: 0;
    background: var(--color-surface);
  }

  .modal__dialog {
    min-height: 100vh;
    border: 0;
    box-shadow: none;
  }

  .modal__viewport {
    min-height: 260px;
    aspect-ratio: 4 / 3;
  }

  .modal__details {
    min-height: 0;
    padding: 30px 24px 28px;
  }

  .modal__details h2 {
    padding-right: 20px;
    font-size: 22px;
    line-height: 31px;
  }

  .modal__author {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 24px;
  }

  .modal__arrow {
    width: 42px;
    height: 42px;
  }
}
</style>
