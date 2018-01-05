<template>
<div id="posters" class="tab-pane" role="tabpanel">
    <h4>Top Posters</h4>
    <div v-if="selected">
        <span v-for="(poster, index) in topPosters" :key="index">
            <img :src="poster" />
        </span>
    </div>
</div>
</template>
<script>
export default {
    props: {
        posters: Array,
        selected: Boolean
    },
    computed: {
        topPosters() {
          return this.posters.slice(0, 8);
        },
    },
}
</script>

