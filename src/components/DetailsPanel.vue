<template>
<div id="details" class="tab-pane fade show active" role="tabpanel">
    <p class="overview">{{content.overview}}</p>
    <p>
        <span v-if="content.firstAired">
            First Aired: {{moment(content.firstAired).format('MMMM Do, YYYY')}}<br />
        </span>
        <span v-if="content.siteRating">
            Rating: {{content.siteRating}}<br />
        </span>
        Network: {{content.network}}<br>
        Status: {{content.status}}<br>
        Seasons: {{content.seasons.seasons}}
    </p>
    <h3>Genres</h3>
    <ul class="genre-list">
        <li v-for="(item, index) in content.genre" :key="index">
            <a :href="getLink(item)" target="_blank">{{item}}</a>
        </li>
    </ul>
    <h4>Top Actors</h4>
    <ActorsList :actors="topActors" />
</div>
</template>

<style>
    ul.genre-list>li>a {
        color: #a5d1ff !important;
    }

    .overview {
        padding: 1rem 0 1rem 0.5rem;
        border-left: 1px solid white;
    }
</style>

<script>
import ActorsList from './ActorsList.vue';

export default {
    props: {
        content: Object
    },
    components: {
        ActorsList
    },
    computed: {
        topActors() {
            return this.content.actors.filter((actor) => actor.sortOrder <= 3).slice(0, 4);
        },
    },
    methods: {
        getLink(item) {
            let genre = item;
            if (item === "Science-Fiction") genre = "Sci-Fi";
            return `https://www.imdb.com/search/title?genres=${genre}`;
        }
    }
}
</script>
