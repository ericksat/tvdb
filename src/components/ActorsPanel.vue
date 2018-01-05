<template>
<div id="actors" class='tab-pane' role='tabpanel'>
    <div class="actors-container" v-if="active">
        <div class="actor-item" v-for="actor in actors" :key="actor.id">
            <div class="actor-item__title"><b>{{actor.name}}</b><br><i>{{actor.role}}</i></div>
            <img v-if="actor.image.length > 0" class="actor-item__image" :src="actor.image" />
        </div>
    </div>
</div>
</template>
<script>
export default {
  props: {
      actors: Array,
      active: Boolean,
  },
}
</script>


