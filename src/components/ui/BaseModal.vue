<template>
  <div class="base-modal" role="presentation" @click.self="requestClose">
    <section
      ref="dialog"
      class="base-modal__dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="labelledBy"
      :style="dialogStyle"
    >
      <button
        ref="closeButton"
        class="base-modal__close"
        type="button"
        :aria-label="closeLabel"
        @click="requestClose"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 5 19 19M19 5 5 19" />
        </svg>
      </button>
      <slot />
    </section>
  </div>
</template>

<script>
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default {
  name: 'BaseModal',
  props: {
    labelledBy: {
      type: String,
      required: true,
    },
    closeLabel: {
      type: String,
      default: 'Закрыть модальное окно',
    },
    maxWidth: {
      type: Number,
      default: 940,
    },
  },
  data() {
    return {
      previousActiveElement: null,
      previousBodyOverflow: '',
    };
  },
  computed: {
    dialogStyle() {
      return {
        maxWidth: `${this.maxWidth}px`,
      };
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
    requestClose() {
      this.$emit('close');
    },
    getFocusableElements() {
      return Array.from(this.$refs.dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (element) => element.offsetParent !== null,
      );
    },
    trapFocus(event) {
      const focusableElements = this.getFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!this.$refs.dialog.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.requestClose();
        return;
      }

      if (event.key === 'Tab') {
        this.trapFocus(event);
        return;
      }

      this.$emit('modal-keydown', event);
    },
  },
};
</script>

<style scoped>
.base-modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  overflow-y: auto;
  place-items: center;
  padding: 32px;
  background: rgba(31, 25, 23, 0.74);
}

.base-modal__dialog {
  position: relative;
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.32);
  background: var(--color-surface);
  box-shadow: 0 28px 80px rgba(20, 15, 13, 0.3);
}

.base-modal__close {
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

.base-modal__close svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1.6;
}

@media (max-width: 800px) {
  .base-modal {
    display: block;
    padding: 20px;
  }

  .base-modal__dialog {
    max-width: 620px !important;
    margin: 0 auto;
  }

  .base-modal__close {
    top: 16px;
    right: 16px;
  }
}

@media (max-width: 480px) {
  .base-modal {
    padding: 0;
    background: var(--color-surface);
  }

  .base-modal__dialog {
    min-height: 100vh;
    border: 0;
    box-shadow: none;
  }
}
</style>
