<template>
<div id="details" class="tab-pane active" role="tabpanel">
    <p>{{content.overview}}</p>
    <p>
        First Aired: {{content.firstAired}}<br />
        Network: {{content.network}}<br />
        Status: {{content.status}}
    </p>
    <h3>Genres</h3>
    <ul>
        <li v-for="(item, index) in content.genre" :key="index">
            {{item}}
        </li>
    </ul>
    <h4>Top Actors</h4>
    <ActorsList :actors="topActors" />
</div>
</template>
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
    }
}
</script>
