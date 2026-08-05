<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <a class="site-header__brand" href="#catalog">Banki.shop</a>

      <nav class="site-header__nav" aria-label="Основная навигация">
        <a href="#catalog">Каталог</a>
        <a href="#delivery">Доставка</a>
        <a href="#payment">Оплата</a>
        <a href="#contacts">Контакты</a>
        <a href="#about">О компании</a>
      </nav>

      <CatalogSearch :value="value" @input="$emit('input', $event)" />
    </div>
  </header>
</template>

<script>
import CatalogSearch from './catalog/CatalogSearch.vue';

export default {
  name: 'SiteHeader',
  components: {
    CatalogSearch,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
.site-header {
  flex: 0 0 96px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.site-header__inner {
  display: flex;
  height: 96px;
  align-items: center;
  justify-content: flex-end;
  gap: 116px;
}

.site-header__brand {
  display: none;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
}

.site-header__nav {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 48px;
  white-space: nowrap;
}

.site-header__nav a {
  position: relative;
  font-size: 14px;
  line-height: 21px;
  text-decoration: none;
}

.site-header__nav a::after {
  position: absolute;
  right: 0;
  bottom: -8px;
  left: 0;
  height: 1px;
  background: currentColor;
  content: '';
  opacity: 0;
  transform: scaleX(0.7);
  transition: opacity 160ms ease, transform 160ms ease;
}

.site-header__nav a:hover::after,
.site-header__nav a:focus-visible::after {
  opacity: 1;
  transform: scaleX(1);
}

@media (max-width: 1279px) {
  .site-header__inner {
    gap: 44px;
  }

  .site-header__nav {
    gap: 24px;
  }
}

@media (max-width: 1020px) {
  .site-header {
    flex-basis: auto;
  }

  .site-header__inner {
    display: grid;
    height: auto;
    min-height: 124px;
    grid-template-columns: auto minmax(280px, 1fr);
    gap: 16px 28px;
    justify-content: stretch;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .site-header__brand {
    display: block;
  }

  .site-header__nav {
    min-width: 0;
    max-width: 100%;
    width: 100%;
    grid-column: 1 / -1;
    justify-content: space-between;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .site-header__nav::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 639px) {
  .site-header__inner {
    display: flex;
    min-height: 0;
    flex-wrap: wrap;
    gap: 16px;
    padding-top: 20px;
    padding-bottom: 16px;
  }

  .site-header__brand {
    width: 100%;
  }

  .site-header__nav {
    justify-content: flex-start;
    order: 3;
    gap: 24px;
    padding: 2px 1px 6px;
  }
}
</style>
