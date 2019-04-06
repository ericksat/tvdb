<template>
<div id="episodes" class='tab-pane fade' role='tabpanel'>
    <p>Total Seasons: {{seasons.seasons}}</p>
    <p>Total episodes: {{seasons.episodes}}</p>
    <h4>Seasons</h4>
    <div class="btn-group" role="group" aria-label="Seasons Button Group">
        <button v-for="season in seasonList" @click="bringMeSeason(season)" :key="season"
        :class="{btn: true, 'btn-season': true, 'btn-info': season === selectedSeason, 'btn-default': season !== selectedSeason }"
        >{{season}}</button>
    </div>
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
        this.selectedSeason = 1;
        this.bringMeSeason(1);
    }
}
</script>
