<template>
  <div class="container">
    <h1 class="top-title">Search the TVDB</h1>
    <SearchBar :super-value="currentSearch" @update="updateContent" @loading="setLoading" @error="searchError" />
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
            currentSearch: "",
        }
    },
    methods: {
      updateContent(newContent) {
        this.loading = false; // Content finished loading
        this.content = newContent;
        this.error = null;
      },
      setLoading(searchValue) { // Set state to loading
          this.loading = status;
          this.content = null;
          this.error = null;
          this.currentSearch = searchValue;
          location.hash = `#${searchValue}`;
      },
      searchError(error) {
          this.loading = false;
          this.content = null;
          this.error = error;
      },
      hashBro() {
            let hasho = window.location.hash.substr(1);
            this.currentSearch = hasho;
            if (this.currentSearch.length === 0) {
                this.updateContent(null);
            }
      }
    },
    components: {
        SearchBar,
        ShowPanel,
        Footer,
    },
    mounted() {
        $(window).on('hashchange', this.hashBro.bind(this));
        if (window.location.hash.length > 1) {
            this.hashBro();
        }
    }
}
</script>
<style>
.top-title {
    margin: 1rem 0;
}
</style>
