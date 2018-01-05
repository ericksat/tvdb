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
    <div class="actors-container">
        <div class="actor-item" v-for="actor in topActors" :key="actor.id">
            <div class="actor-item__title"><b>{{actor.name}}</b><br><i>{{actor.role}}</i></div>
            <img v-if="actor.image.length > 0" class="actor-item__image" :src="actor.image" />
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        content: Object
    },
    computed: {
        topActors() {
            return this.content.actors.filter((actor) => actor.sortOrder <= 3).slice(0, 3);
        },
    }
}
</script>
