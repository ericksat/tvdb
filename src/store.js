import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        loading: false,
        content: null,
        error: null,
        currentSearch: "",
        suggestions: [],
    },
    getters: {
        loading(state) {
            return state.loading
        },
        error(state) {
            return state.error
        },
        content(state) {
            return state.content
        },
        currentSearch(state) {
            return state.currentSearch
        },
        suggestions(state) {
            return state.suggestions
        },
    },
    mutations: {
        loading(state, isLoading) {
            state.loading = !!isLoading;
        },
        search(state, searchValue) {
            state.currentSearch = searchValue;
        },
        newSearch(state, searchValue) {
            state.loading = true;
            state.content = null;
            state.error = null;
            state.currentSearch = searchValue;
            // Note: Firefox removes that part, even if we add it ourselves. Oh well?
            window.location.hash = `#${encodeURIComponent(searchValue)}`;
        },
        addSuggestion(state, suggestion) {
            suggestion = decodeURIComponent(suggestion);
            if (state.suggestions.indexOf(suggestion) == -1) {
                console.log("New search value " + suggestion);
                state.suggestions.push(suggestion);
            }
        },
        content(state, newContent) {
            state.content = newContent;
        },
        searchError(state, error) {
            state.loading = false;
            state.content = null;
            state.error = error;
        },
        reset(state) {
            state.loading = false; // Content finished loading
            state.error = null;
            state.content = null;
            state.currentSearch = "";
        },
        updateSuggestions(state, suggestions) {
            state.suggestions = suggestions;
        },
    },
    actions: {
        loading( { commit }, isLoading) {
            setTimeout(() => {
                commit('loading', isLoading);
            }, 100);
        },
        updateContent({commit}, payload) {
            commit('reset');
            commit('content', payload.newContent);
            commit('addSuggestion', payload.searchValue);
        },
        hashChange({commit}, hasho) {
            commit('search', hasho);
            if (hasho.length === 0) { // Sorta like after update content
                commit('reset');
                commit('content', null);
            }
        },
        getSuggestions({commit}) {
            $.get(`/suggestions`).then((res) => {
                if (res.success) {
                    commit('updateSuggestions', res.suggestions);
                }
            });
        },
    }
});