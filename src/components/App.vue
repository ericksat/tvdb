<template>
  <section>
    <section class="topbar">
      <div class="container">
        <!-- <h1 class="top-title">Search the TVDB</h1> -->
        <SearchBar/>
      </div>
    </section>

    <div class="container">
      <div v-if="error" class="alert alert-danger mt-2">Error: {{error}}</div>
      <ShowPanel v-if="!error"/>
      <Footer/>
    </div>
  </section>
</template>
<script>
import SearchBar from "./SearchBar.vue";
import ShowPanel from "./ShowPanel.vue";
import Footer from "./Footer.vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      error: "error"
    })
  },
  methods: {
    hashBro() {
      this.$store.dispatch("hashChange", window.location.hash.substr(1));
    }
  },
  components: {
    SearchBar,
    ShowPanel,
    Footer
  },
  mounted() {
    $(window).on("hashchange", this.hashBro.bind(this));
    if (window.location.hash.length > 1) this.hashBro(); // Initial run if necessary

    this.$store.dispatch("getSuggestions");
  }
};
</script>
<style>
.top-title {
  margin: 1rem 0;
  font-size: 3em;
}

@media screen and (max-width: 575px) {
  .top-title {
    font-size: 2em;
  }
}

.topbar {
    position: sticky;
    top: 0;
    padding-top: 1rem;
    margin-top: -1rem;
    padding-bottom: 1rem;
    background: #222;
    border-bottom: 1px solid #fff;
    background-image: linear-gradient(to bottom, #484747 0%, #828181 125%);
}
</style>
