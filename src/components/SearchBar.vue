<template>
    <form @submit.prevent="onSubmit" class="search-form">
        <input class="form-control" type="search" name="searcho" placeholder="Search the TVDB"
        @focus="elementFocus" @blur="elementBlur" v-model="value" list="datolisto" />
        <button type="submit" class="btn btn-primary" aria-label="Search">
            <i class="fas fa-tv"></i>
        </button>
        <datalist id="datolisto">
            <option v-for="(item, index) in suggestions" :key="index">{{item}}</option>
        </datalist>
    </form>
</template>

<style>
    .search-form {
        display: flex;
        max-width: 21rem;
    }
</style>

<script>
// import _ from 'lodash';
import {mapGetters} from 'vuex';

export default {
    props: {
        superValue: String,
    },
    data() {
        return {
            value: "",
            request: null,
            // suggestions: []
        }
    },
    computed: {
        ...mapGetters({
            suggestions: "suggestions",
            searchValue: "currentSearch"
        })
    },
    methods: {
        elementFocus() {
            document.querySelector(".topbar").classList.add("focus");
        },
        elementBlur() {
            document.querySelector(".topbar").classList.remove("focus");
        },
        onSubmit() {
            let searchValue = this.value.trim();
            if (searchValue.length === 0) return;

            this.$store.commit('newSearch', searchValue);
            this.findShow(searchValue);
        },
        findShow(value) {
            let finalValue = encodeURIComponent(value);
            this.request = $.get(`/show/${finalValue}`);
            this.request.then((res) => {
                this.request = null; // Done;
                if (res.error) {
                    this.$store.commit('searchError', res.error);
                    return;
                }
                this.$store.dispatch('updateContent', { newContent: res, searchValue: value} );
            });
        },
        // findSuggestions: _.throttle(function() {
        //     let query = encodeURIComponent(this.value.trim());
        //     if (query.length < 2) return;
        //     let request = $.get(`/suggestions/${query.substr(0,2)}`);
        //     request.then((res) => {
        //         if (res.success) {
        //             this.suggestions = res.suggestions;
        //         }
        //     });
        // }, 1000)
    },
    watch: {
        searchValue(newValue) { // Update search value from parent.
            // console.log("Supervalue updated to " + newValue);
            newValue = decodeURIComponent(newValue)
            if (newValue !== this.value) {
                if (this.request) {
                    // console.log("Aborting call");
                    this.request.abort();
                    this.request = null;
                }
                // console.log("Resubmitting");
                this.value = newValue;
                this.onSubmit();
            }
        },
    }
}
</script>
