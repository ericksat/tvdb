<template>
<div class="container-fluid" style="margin-top: 2rem">
    <div v-if="loading">
        Loading, please wait ...
    </div>
    <div v-if="content" class="show-container">
        <img :src="content.banner" />
        <h3>{{content.seriesName}} {{aliases}}</h3>
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
.actors-container {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
}

.actor-item {
    float: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px;
    margin: 6px;
    border: 1px solid white;
    border-radius: 8px;
    background-color: #444;
    width: 12.5rem;
}

.actor-item__title {
    text-align: center;
    padding-bottom: 0.5rem;
}

.actor-item__image {
    height: 192px;
    object-fit: cover;
}
</style>