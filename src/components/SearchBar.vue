<template>
    <form @submit.prevent="onSubmit" class="form-inline">
        <div class="form-group">
            <input class="form-control" type="search" name="searcho" placeholder="Type here to search" v-model="value" list="datolisto" />
            <button type="submit" class="btn btn-primary">Search</button>
        </div>
        <datalist id="datolisto">
            <option v-for="(item, index) in suggestions" :key="index">{{item}}</option>
        </datalist>
    </form>
</template>
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
