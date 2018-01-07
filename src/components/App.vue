<template>
  <div class="container">
    <h1 class="top-title">Search the TVDB</h1>
    <SearchBar @update="updateContent" @loading="setLoading" @error="searchError" />
    <div v-if="error" class="alert alert-danger mt-2">Error: {{error}}</div>
    <ShowPanel :content="content" :loading="loading" v-if="!error" />
    <Footer />
  </div>
</template>
<script>
import SearchBar from './SearchBar.vue';
import ShowPanel from './ShowPanel.vue';
import Footer from './Footer.vue';

export default {
  data() {
    return {
        content: null,
        loading: false,
        error: null,
    }
  },
  methods: {
      updateContent(newContent) {
        this.loading = false; // Content finished loading
        this.content = newContent;
        this.error = null;
      },
      setLoading() { // Set state to loading
          this.loading = status;
          this.content = null;
          this.error = null;
      },
      searchError(error) {
          this.loading = false;
          this.content = null;
          this.error = error;
      }
  },
  components: {
      SearchBar,
      ShowPanel,
      Footer,
  },
}
</script>
<style>
.top-title {
    margin: 1rem 0;
}
</style>
