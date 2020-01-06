<template>
<div class="actors-container">
    <div class="actor-item" v-for="actor in actors" :key="actor.id">
        <div class="actor-item__name"><a :href="linko(actor.name)" target="_blank">{{actor.name}}</a></div>
        <div class="actor-item__role">{{actor.role}}</div>
        <img class="actor-item__image" :src="actor.image" />
    </div>
</div>
</template>
<script>
export default {
    props: {
        actors: Array
    },
    methods: {
        linko(name) {
            return `http://www.imdb.com/find?s=nm&q=${name}`;
        }
    }
}
</script>
<style>
.actors-container {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.actor-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.5rem;
    margin: 0.5rem 0.25rem;
    border: 1px solid white;
    border-radius: 0.5rem;
    background-color: #444;
    width: 98%;
}

@media screen and (min-width:576px) {
    .actor-item {
        width: 48%;
    }
}

@media screen and (min-width:992px) {
    .actor-item {
        width: 24%;
    }
}

.actor-item__name {
    text-align: center;
    font-weight: bold;
}

.actor-item__name a {
    color: white;
}

.actor-item__role {
    text-align: center;
    padding-bottom: 0.5rem;
    font-style: italic;
    max-height: 70px;
    overflow: hidden;
}

.actor-item__image {
    /* height: 192px; */
    object-fit: contain;
    width: 100%;
}
</style>
