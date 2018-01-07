<template>
<div id="actors" class='tab-pane' role='tabpanel'>
    <ActorsList v-if="active" :actors="actors" />
</div>
</template>
<script>
import ActorsList from './ActorsList.vue';

export default {
  props: {
      actors: Array,
      active: Boolean,
  },
  components: {
      ActorsList
  }
}
</script>


