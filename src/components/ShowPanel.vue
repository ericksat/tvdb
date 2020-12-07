<template>
<div class='showPanel'>
    <div v-if="!loading && !content">
        <h1 class="welcome-text">
            Welcome to Shmoofel's TVDB Search.<br>
            Please use the search bar to begin.
        </h1>
    </div>
    <div v-if="loading" class="loader__container">
        <div class="loader"></div>
    </div>
    <div v-if="content" class="show__container">
        <img :src="content.banner" class="show__banner" />
        <h3 class="show__title">{{content.seriesName}} {{aliases}}</h3>
        <ul class="nav nav-pills" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" href="#details" role="tab" data-toggle="tab" @click="selectDetails" title="Details" aria-label="Details">
                    <i class="fas fa-info pr-md-1"></i>
                    <span class="d-none d-md-inline">Details</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#actors" role="tab" data-toggle="tab" @click="selectActors" aria-label="Actors" title="Actors">
                    <i class="fas fa-user-ninja pr-md-1"></i>
                    <span class="d-none d-md-inline">Actors</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#episodes" role="tab" data-toggle="tab" @click="selectEpisodes" aria-label="Episodes" title="Episodes">
                    <i class="fas fa-file-alt pr-md-1"></i>
                    <span class="d-none d-md-inline">Episodes</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#posters" role="tab" data-toggle="tab" @click="selectPosters" aria-label="Posters" title="Posters">
                    <i class="far fa-file-image pr-md-1"></i>
                    <span class="d-none d-md-inline">Posters</span>
                </a>
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

<style>
.showPanel {
    margin-top: 2rem;
}

@media screen and (max-width: 575px) {
    .showPanel {
        margin-top: 1.1rem;
    }
}

.welcome-text {
    font-size: 1.7rem;
}

.show__container {
    padding-bottom: 2.5rem; /* To adjust for footer */
}

.show__banner {
    width: 100%;
}

.show__title {
    margin: 1rem 0;
}

/* @media screen and (max-width: 575px) {
    a.nav-link {
        padding-right: 1rem;
        padding-left: 1rem;
    }
} */

a.nav-link {
    transition: background-color 0.35s;
}
</style>

<script>
import ActorsPanel from './ActorsPanel.vue';
import DetailsPanel from './DetailsPanel.vue';
import SeasonPanel from './SeasonPanel.vue';
import PostersPanel from './PostersPanel.vue';
import {mapGetters} from 'vuex';

export default {
  props: {
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
    ...mapGetters({
        content: "content",
        loading: "loading",
    }),
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