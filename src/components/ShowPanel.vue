<template>
<div style="margin-top: 2rem">
    <div v-if="loading" class="loader__container">
        <div class="loader"></div>
    </div>
    <div v-if="content" class="show__container">
        <img :src="content.banner" class="show__banner" />
        <h3 class="show__title">{{content.seriesName}} {{aliases}}</h3>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" href="#details" role="tab" data-toggle="tab" @click="selectDetails">Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#actors" role="tab" data-toggle="tab" @click="selectActors">Actors</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#episodes" role="tab" data-toggle="tab" @click="selectEpisodes">Episodes</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#posters" role="tab" data-toggle="tab" @click="selectPosters">Posters</a>
            </li>
        </ul>
        <div class="tab-content">
            <DetailsPanel :content="content" />
            <ActorsPanel :actors="content.actors" :active="actorsSelected" />
            <SeasonPanel :seasons="content.seasons" :show-id="content.id" />
            <PostersPanel :posters="content.posters" :selected="postersSelected" />
        </div>
    </div>
</div>
</template>
<script>
import ActorsPanel from './ActorsPanel.vue';
import DetailsPanel from './DetailsPanel.vue';
import SeasonPanel from './SeasonPanel.vue';
import PostersPanel from './PostersPanel.vue';

export default {
  props: {
      content: Object,
      loading: Boolean,
  },
  components: {
      ActorsPanel,
      DetailsPanel,
      SeasonPanel,
      PostersPanel,
  },
  data() {
      return {
          postersSelected: false,
          actorsSelected: false,
      }
  },
  computed: {
    aliases() {
        return this.content.aliases.length ? ` (AKA: ${this.content.aliases})` : '';
    },
  },
  methods: {
      selectPosters() {
          this.postersSelected = true;
        //   this.actorsSelected = false;
      },
      selectActors() {
        //   this.postersSelected = false;
          this.actorsSelected = true;
      },
      selectEpisodes() {
        //   this.postersSelected = false;
        //   this.actorsSelected = false;
      },
      selectDetails() {
        //   this.postersSelected = false;
        //   this.actorsSelected = false;
      },
  },
  beforeUpdate() {
      if (!this.content) { // Reset status
          this.postersSelected = false;
          this.actorsSelected = false;
      }
  }
}
</script>
<style>
.show__container {
    padding-bottom: 2.5rem; /* To adjust for footer */
}

.show__banner {
    width: 100%;
}

.show__title {
    margin: 1rem 0;
}
</style>