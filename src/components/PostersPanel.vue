<template>
<div id="posters" class="tab-pane fade" role="tabpanel">
    <div v-if="selected">
        <div v-if="!chosenPoster" class="posters__list">
            <h4>Top Posters</h4>
            <span v-for="(poster, index) in topPosters" :key="index">
                <img :src="poster" @click="choosePoster(poster)" />
            </span>
        </div>
        <div class="posters__big" v-if="chosenPoster" @click="choosePoster(null)">
            <img :src="chosenPoster" class="clickable" />
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
            loadedPosters: 12,
            busy: false,
        }
    },
    computed: {
        topPosters() {
          return this.posters.slice(0, this.loadedPosters);
        },
    },
    methods: {
        choosePoster(src) {
            if (src !== null) {
                src = src.replace(/_cache\//, "");
            }
            if (this.chosenPoster !== src) {
                this.chosenPoster = src;
            }
        },
        handleScroll: function () {
            if (!this.selected || this.busy) return;
            // this.scrollPos = document.body.scrollHeight - window.innerHeight - document.body.scrollTop;
            // let res = document.body.scrollHeight - window.innerHeight - window.scrollY;
            let res = $(document).height() - $(window).height() - $(window).scrollTop();
            // console.log(res);
            if (res <= 2) {
                if (this.posters.length <= this.loadedPosters) {
                    return;
                }
                this.loadedPosters += 4;
                this.busy = true; // Tiny throttling to prevent double triggering
                // console.log("Scrolled to bottom, loaded posters = " + this.loadedPosters);
                setTimeout(() => this.busy = false, 250);
            }
        }
    },
    watch: {
        posters(newValue) { // Update search value from parent.
            // console.log("Supervalue updated to " + newValue);
            this.loadedPosters = 12; // Reset that.
        },
    },
    mounted: function () {
        // console.log("Created scroll");
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed: function () {
        // console.log("Removed scroll");
        window.removeEventListener('scroll', this.handleScroll)
    },
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

