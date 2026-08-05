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

      <form class="site-header__search" role="search" @submit.prevent>
        <label class="sr-only" for="catalog-search">Поиск по названию картины</label>
        <input
          id="catalog-search"
          :value="searchQuery"
          type="search"
          autocomplete="off"
          placeholder="Поиск по названию картины"
          @input="$emit('update:search-query', $event.target.value)"
        />
        <button type="submit">Найти</button>
      </form>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SiteHeader',
  props: {
    searchQuery: {
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

.site-header__search {
  display: flex;
  width: 448px;
  height: 48px;
  flex: 0 0 448px;
}

.site-header__search input {
  width: 326px;
  min-width: 0;
  padding: 0 16px;
  border: 1px solid var(--color-border);
  border-right: 0;
  border-radius: 0;
  outline: 0;
  background: transparent;
  appearance: none;
  font-size: 14px;
  line-height: 21px;
}

.site-header__search input::placeholder {
  color: #aaa5a2;
  opacity: 1;
}

.site-header__search input:focus {
  border-color: var(--color-action);
  box-shadow: inset 0 0 0 1px var(--color-action);
}

.site-header__search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.site-header__search button {
  width: 122px;
  flex: 0 0 122px;
  border: 1px solid var(--color-action);
  color: #fff;
  background: var(--color-action);
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: background-color 160ms ease, border-color 160ms ease;
}

.site-header__search button:hover {
  border-color: var(--color-action-hover);
  background: var(--color-action-hover);
}

@media (max-width: 1279px) {
  .site-header__inner {
    gap: 44px;
  }

  .site-header__nav {
    gap: 24px;
  }

  .site-header__search {
    width: 380px;
    flex-basis: 380px;
  }

  .site-header__search input {
    width: 270px;
  }

  .site-header__search button {
    width: 110px;
    flex-basis: 110px;
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
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .site-header__brand {
    display: block;
  }

  .site-header__search {
    width: 100%;
    flex-basis: auto;
  }

  .site-header__search input {
    width: auto;
    flex: 1 1 auto;
  }

  .site-header__nav {
    width: 100%;
    grid-column: 1 / -1;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
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

  .site-header__search {
    height: 46px;
    order: 2;
  }

  .site-header__search input {
    padding: 0 12px;
    font-size: 13px;
  }

  .site-header__search button {
    width: 88px;
    flex-basis: 88px;
  }

  .site-header__nav {
    justify-content: flex-start;
    order: 3;
    gap: 24px;
    overflow-x: auto;
    padding: 2px 1px 6px;
    scrollbar-width: none;
  }

  .site-header__nav::-webkit-scrollbar {
    display: none;
  }
}
</style>
