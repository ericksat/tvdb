<template>
<div id="episodes" class='tab-pane' role='tabpanel'>
    <p>Total Seasons: {{seasons.seasons}}</p>
    <p>Total episodes: {{seasons.episodes}}</p>
    <h4>Seasons</h4>
    <button v-for="season in seasonList" @click="bringMeSeason(season)" :key="season"
    v-bind:class="{btn: true, 'btn-season': true, 'btn-info': season === selectedSeason, 'btn-default': season !== selectedSeason }"
    >{{season}}</button>
    <div v-if="selectedSeason" class="mt-3">
        <div v-for="episode in episodes" :key="episode.absoluteNumber">
            <h5>{{ episode.episodeName }} ({{episode.firstAired}})</h5>
            <p>
                {{ episode.overview}}
            </p>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        seasons: Object,
        showId: Number,
    },
    data() {
        return {
            selectedSeason: 0,
            episodes: null,
        }
    },
    computed: {
        seasonList() {
          let seasons = [];
            for (let i=0; i < this.seasons.seasons; i++) {
                seasons.push(i+1);
            }
            return seasons;
        },
    },
    methods: {
        bringMeSeason(n) {
          $.get(`/episodes/${this.showId}/${n}`).then((res) => {
              if (res.success === false) {
                  alert("Sorry, error.");
                  return;
              }

              this.selectedSeason = n;
              this.episodes = res.episodes;
          });
      },
    },
    mounted() {
        // console.log("Seasons panel mounted");
    }
}
</script>
