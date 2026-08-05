<template>
  <div class="product-gallery" aria-label="Галерея товара">
    <div class="product-gallery__viewport">
      <img
        v-if="currentImage && !currentImageFailed"
        :key="currentImage.id"
        :src="currentImage.src"
        :alt="currentImage.alt"
        :style="currentImageStyle"
        decoding="async"
        @error="markCurrentImageAsFailed"
      />
      <div
        v-else
        class="product-gallery__placeholder"
        role="img"
        :aria-label="currentImage ? currentImage.alt : 'Изображение товара недоступно'"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 5h16v14H4zM4 16l4.5-4.5 3 3L14 12l6 5" />
          <circle cx="15.5" cy="8.5" r="1.5" />
        </svg>
        <span>Изображение недоступно</span>
      </div>

      <template v-if="hasMultipleImages">
        <button
          class="product-gallery__arrow product-gallery__arrow--previous"
          type="button"
          aria-label="Предыдущее изображение"
          @click="showPrevious"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
        <button
          class="product-gallery__arrow product-gallery__arrow--next"
          type="button"
          aria-label="Следующее изображение"
          @click="showNext"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </template>
    </div>

    <div v-if="hasMultipleImages" class="product-gallery__dots" aria-label="Выбор изображения">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        type="button"
        :class="{ 'is-active': index === currentIndex }"
        :aria-label="`Показать изображение ${index + 1}`"
        :aria-current="index === currentIndex ? 'true' : null"
        @click="setCurrentIndex(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductGallery',
  props: {
    images: {
      type: Array,
      required: true,
      validator: (value) => value.length > 0,
    },
  },
  data() {
    return {
      currentIndex: 0,
      failedImageIds: {},
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || null;
    },
    currentImageFailed() {
      return Boolean(this.currentImage && this.failedImageIds[this.currentImage.id]);
    },
    currentImageStyle() {
      if (!this.currentImage) {
        return {};
      }

      return {
        objectPosition: this.currentImage.position,
        transform: `scale(${this.currentImage.zoom})`,
        transformOrigin: this.currentImage.position,
      };
    },
    hasMultipleImages() {
      return this.images.length > 1;
    },
  },
  watch: {
    images() {
      this.currentIndex = 0;
      this.failedImageIds = {};
      this.$emit('change', 0);
    },
  },
  methods: {
    setCurrentIndex(index) {
      if (!this.images.length) {
        return;
      }

      const normalizedIndex = (index + this.images.length) % this.images.length;
      this.currentIndex = normalizedIndex;
      this.$emit('change', normalizedIndex);
    },
    showPrevious() {
      this.setCurrentIndex(this.currentIndex - 1);
    },
    showNext() {
      this.setCurrentIndex(this.currentIndex + 1);
    },
    markCurrentImageAsFailed() {
      if (this.currentImage) {
        this.$set(this.failedImageIds, this.currentImage.id, true);
      }
    },
  },
};
</script>

<style scoped>
.product-gallery {
  position: relative;
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  background: #28211f;
}

.product-gallery__viewport {
  position: relative;
  min-height: 500px;
  flex: 1 1 auto;
  overflow: hidden;
}

.product-gallery__viewport img,
.product-gallery__placeholder {
  width: 100%;
  height: 100%;
}

.product-gallery__viewport img {
  object-fit: cover;
  animation: product-gallery-reveal 280ms ease;
}

.product-gallery__placeholder {
  display: grid;
  place-items: center;
  align-content: center;
  gap: 12px;
  color: #d7ceca;
  background: #342b28;
}

.product-gallery__placeholder svg {
  width: 48px;
  height: 48px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.3;
}

.product-gallery__arrow {
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

.product-gallery__arrow:hover {
  background: rgba(40, 33, 31, 0.86);
}

.product-gallery__arrow--previous {
  left: 20px;
}

.product-gallery__arrow--next {
  right: 20px;
}

.product-gallery__arrow svg {
  width: 23px;
  height: 23px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.product-gallery__dots {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 25px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.product-gallery__dots button {
  width: 9px;
  height: 9px;
  padding: 0;
  border: 1px solid #fff;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.product-gallery__dots button.is-active {
  background: #fff;
}

@keyframes product-gallery-reveal {
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
  .product-gallery__viewport {
    min-height: 330px;
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 480px) {
  .product-gallery__viewport {
    min-height: 260px;
    aspect-ratio: 4 / 3;
  }

  .product-gallery__arrow {
    width: 42px;
    height: 42px;
  }
}
</style>
