import Vue from 'vue'
import App from './App.vue'

import SearchBar from './components/SearchBar.vue';
import ShowPanel from './components/ShowPanel.vue';

import './app.css';

new Vue({
  el: '#app',
  components: {
      SearchBar,
      ShowPanel,
  },
  data() {
      return {
          content: null
      }
  },
  template: `
  <div class="container">
    <h1>Search the TVDB</h1>
    <SearchBar @update="updateContent" />
    <ShowPanel :content="content" />
  </div>
  `,
  methods: {
      updateContent(newContent) {
        this.content = newContent;
      }
  }
})
