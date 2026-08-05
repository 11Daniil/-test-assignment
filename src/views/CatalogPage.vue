<template>
  <div class="app-shell">
    <SiteHeader v-model="searchQuery" />
    <ProductCatalog :query="searchQuery" @clear-search="searchQuery = ''" />
    <SiteFooter />
  </div>
</template>

<script>
import ProductCatalog from '../components/catalog/ProductCatalog.vue';
import SiteFooter from '../components/SiteFooter.vue';
import SiteHeader from '../components/SiteHeader.vue';

export default {
  name: 'CatalogPage',
  components: {
    ProductCatalog,
    SiteFooter,
    SiteHeader,
  },
  data() {
    return {
      searchQuery: '',
    };
  },
};
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}
</style>
