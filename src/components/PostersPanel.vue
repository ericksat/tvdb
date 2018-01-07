<template>
<div id="posters" class="tab-pane" role="tabpanel">
    <div v-if="selected">
        <div v-if="!chosenPoster" class="posters__list">
            <h4>Top Posters</h4>
            <span v-for="(poster, index) in topPosters" :key="index">
                <img :src="poster" @click="choosePoster(poster)" />
            </span>
        </div>
        <div class="posters__big" v-if="chosenPoster">
            <button class="btn btn-info" @click="choosePoster(null)">Back</button>
            <img :src="chosenPoster" />
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        posters: Array,
        selected: Boolean
    },
    data() {
        return {
            chosenPoster: null,
        }
    },
    computed: {
        topPosters() {
          return this.posters.slice(0, 10);
        },
    },
    methods: {
        choosePoster(src) {
            if (src !== null) {
                src = src.replace(/_cache\//, "");
            }
            this.chosenPoster = src;
        }
    }
}
</script>
<style>
.posters__list img {
    display: inline-block;
    margin: 8px;
    border: 1px solid #808080;
    border-radius: 16px;
    width: 128px;
    cursor: pointer;
}

@media screen and (min-width: 600px) {
    .posters__list img {
        width: 192px;
    }
}

@media screen and (min-width: 1024px) {
    .posters__list img {
        width: 256px;
    }
}

.posters__big button {
    display: block;
    width: 12rem;
    margin-left: 0.5rem;
}

.posters__big img {
    margin: 8px;
    border: 1px solid #808080;
    border-radius: 16px;
    width: 100%;
}

@media screen and (min-width: 768px) {
    .posters__big img {
        width: 645px;
    }
}

</style>

