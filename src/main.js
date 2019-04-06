import Vue from 'vue'
import App from './components/App.vue'

import './app.css';
import { store } from './store';

import moment from 'moment';
Vue.prototype.moment = moment

new Vue({
  el: '#app',
  template: `<App />`,
  store,
  components: {
      App
  }
})
