<template>
<div id="details" class="tab-pane fade show active" role="tabpanel">
    <div class="details-info">
        <div v-if="content.firstAired">
            <i class="far fa-calendar-alt"></i>
            First Aired: {{moment(content.firstAired).format('MMMM Do, YYYY')}}
        </div>
        <div v-if="content.siteRating">
            <i class="far fa-star"></i>
            Rating: {{content.siteRating}}
        </div>
        <div>
            <i class="fas fa-hashtag"></i>
            Status: {{content.status}}
        </div>
        <div>
            <i class="fas fa-cloud-sun-rain"></i>
            Seasons: {{content.seasons.seasons}}
        </div>
        <div>
            <i class="fas fa-building"></i>
            Network: {{content.network}}
        </div>
    </div>
    <p class="overview">{{content.overview}}</p>
    <h4>Genres</h4>
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

    .details-info {
        padding: 1rem 0 0.5rem;
    }

    .details-info > div {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }

    .details-info > div > i {
        width: 1.5rem;
        text-align: center;
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
