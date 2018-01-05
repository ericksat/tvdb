<template>
  <div class="container">
    <h1>Search the TVDB</h1>
    <SearchBar @update="updateContent" @loading="setLoading" />
    <ShowPanel :content="content" :loading="loading" />
  </div>
</template>
<script>
import SearchBar from './SearchBar.vue';
import ShowPanel from './ShowPanel.vue';

export default {
  data() {
    return {
        content: null,
        loading: false
    }
  },
  methods: {
      updateContent(newContent) {
        this.loading = false; // Content finished loading
        this.content = newContent;
      },
      setLoading() { // Set state to loading
          this.loading = status;
          this.content = null;
      }
  },
  components: {
      SearchBar,
      ShowPanel,
  },
}
</script>

