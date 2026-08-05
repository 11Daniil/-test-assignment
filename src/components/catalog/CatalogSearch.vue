<template>
  <form class="catalog-search" role="search" @submit.prevent="$emit('submit', value)">
    <label class="sr-only" :for="inputId">Поиск по названию картины</label>
    <input
      :id="inputId"
      :value="value"
      type="search"
      autocomplete="off"
      placeholder="Поиск по названию картины"
      @input="$emit('input', $event.target.value)"
    />
    <button type="submit">Найти</button>
  </form>
</template>

<script>
export default {
  name: 'CatalogSearch',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    inputId: {
      type: String,
      default: 'catalog-search',
    },
  },
};
</script>

<style scoped>
.catalog-search {
  display: flex;
  width: 448px;
  height: 48px;
  flex: 0 0 448px;
}

.catalog-search input {
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

.catalog-search input::placeholder {
  color: #aaa5a2;
  opacity: 1;
}

.catalog-search input:focus {
  border-color: var(--color-action);
  box-shadow: inset 0 0 0 1px var(--color-action);
}

.catalog-search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.catalog-search button {
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

.catalog-search button:hover {
  border-color: var(--color-action-hover);
  background: var(--color-action-hover);
}

@media (max-width: 1279px) {
  .catalog-search {
    width: 380px;
    flex-basis: 380px;
  }

  .catalog-search input {
    width: 270px;
  }

  .catalog-search button {
    width: 110px;
    flex-basis: 110px;
  }
}

@media (max-width: 1020px) {
  .catalog-search {
    width: 100%;
    flex-basis: auto;
  }

  .catalog-search input {
    width: auto;
    flex: 1 1 auto;
  }
}

@media (max-width: 639px) {
  .catalog-search {
    height: 46px;
    order: 2;
  }

  .catalog-search input {
    padding: 0 12px;
    font-size: 13px;
  }

  .catalog-search button {
    width: 88px;
    flex-basis: 88px;
  }
}
</style>
