<template>
<div class="container-fluid" style="margin-top: 2rem">
    <div v-if="content" class="show-container">
        <img :src="content.banner" />
        <h3>{{content.seriesName}} {{aliases}}</h3>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" href="#details" role="tab" data-toggle="tab" @click="selectDetails">Details</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#episodes" role="tab" data-toggle="tab" @click="selectEpisodes">Episodes</a>
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
                    <h4>Top Actors</h4>
                    <div class="actors-container">
                        <div class="actor-item" v-for="actor in topActors">
                            <div class="actor-item__title"><b>{{actor.name}}</b> as <i>{{actor.role}}</i></div>
                            <img class="actor-item__image" :src="actorImg(actor.image)" />
                        </div>
                    </div>
                </div>
            </div>
            <div id="episodes" class='tab-pane' role='tabpanel'>
                <p>Total Seasons: {{content.seasons.seasons}}</p>
                <p>Total episodes: {{content.seasons.episodes}}</p>
                <h4>Seasons</h4>
                <button v-for="season in seasonList" @click="bringMeSeason(season)"
                v-bind:class="{btn: true, 'btn-season': true, 'btn-info': season === selectedSeason, 'btn-default': season !== selectedSeason }"
                >{{season}}</button>
                <div v-if="selectedSeason" class="mt-3">
                    <div v-for="episode in episodes">
                        <h5>{{ episode.episodeName }} ({{episode.firstAired}})</h5>
                        <p>
                            {{ episode.overview}}
                        </p>
                    </div>
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
          selectedSeason: 0,
          episodes: null,
      }
  },
  computed: {
      aliases() {
          return this.content.aliases.length ? ` (AKA: ${this.content.aliases})` : '';
      },
      topActors() {
          return this.content.actors.filter((actor) => actor.sortOrder <= 2);
      },
      topPosters() {
          return this.content.posters.slice(0, 9);
      },
      seasonList() {
          let seasons = [];
          for (let i=0; i < this.content.seasons.seasons; i++) {
              seasons.push(i+1);
          }
          return seasons;
      },
  },
  methods: {
      selectPosters() {
          this.postersSelected = true;
      },
      selectEpisodes() {
          this.postersSelected = false;
      },
      selectDetails() {
          this.postersSelected = false;
      },
      bringMeSeason(n) {
          $.get(`/episodes/${this.content.id}/${n}`).then((res) => {
              if (res.success === false) {
                  alert("Sorry, error.");
                  return;
              }

              this.selectedSeason = n;
              this.episodes = res.episodes;
          });
      },
      actorImg(image) {
          return `https://www.thetvdb.com/banners/_cache/${image}`;
      }
  }
}
</script>
