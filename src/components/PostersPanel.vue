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
          return this.posters.slice(0, 10);
        },
    },
}
</script>
<style>
#posters img {
    display: inline-block;
    margin: 8px;
    border: 1px solid #808080;
    border-radius: 16px;
    width: 128px;
}

@media screen and (min-width: 600px) {
    #posters img {
        width: 192px;
    }
}

@media screen and (min-width: 1024px) {
    #posters img {
        width: 256px;
    }
}
</style>

