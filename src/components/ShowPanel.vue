<template>
<div class="container-fluid" style="margin-top: 2rem">
    <div v-if="content" class="show-container">
        <img :src="getImage" />
        <h3>{{content.seriesName}} {{aliases}}</h3>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" href="#details" role="tab" data-toggle="tab" @click="selectDetails">Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#episodes" role="tab" data-toggle="tab">Episodes</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#posters" role="tab" data-toggle="tab" @click="selectPosters">Posters</a>
            </li>
        </ul>
        <div class="tab-content">
            <div id="details" class="tab-pane active" role="tabpanel">
                <p>{{content.overview}}</p>
                <p>
                    First Aired: {{content.firstAired}}<br />
                    Network: {{content.network}}<br />
                    Status: {{content.status}}
                </p>
                <div>
                    <h3>Genres</h3>
                    <ul>
                        <li v-for="item in content.genre">
                            {{item}}
                        </li>
                    </ul>
                    <h4>Seasons</h4>
                    <p>Total Seasons: {{content.seasons.seasons}}</p>
                    <p>Total episodes: {{content.seasons.episodes}}</p>
                    <h4>Top Actors</h4>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="actor in topActors">
                            <b>{{actor.name}}</b> as <i>{{actor.role}}</i>
                        </li>
                    </ul>
                </div>
            </div>
            <div id="posters" class="tab-pane" role="tabpanel">
                <h4>Top Posters</h4>
                <div v-if="postersSelected">
                    <span v-for="poster in topPosters">
                        <img :src="poster" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
  props: {
      content: {
          type: Object,
      }
  },
  data() {
      return {
          postersSelected: false,
      }
  },
  computed: {
      getImage() {
          return `https://www.thetvdb.com/banners/${this.content.banner}`;
      },
      aliases() {
          return this.content.aliases.length ? ` (AKA: ${this.content.aliases})` : '';
      },
      topActors() {
          return this.content.actors.filter((actor) => actor.sortOrder <= 2);
      },
      topPosters() {
          return this.content.posters.slice(0, 9);
      },
  },
  methods: {
      selectPosters() {
          console.log("Selecting posters");
          this.postersSelected = true;
      },
      selectDetails() {
          this.postersSelected = false;
      }
  }
}
</script>
