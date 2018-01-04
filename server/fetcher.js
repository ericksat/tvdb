const axios = require('axios');
const cache = require('./db');
const fs = require('fs');

const APIKEY = 'F23C95D5D38FE20E';
const REMOTE = 'https://api.thetvdb.com/';
const REMOTE_PUBLIC = 'https://www.thetvdb.com/';
const CACHE_DEFAULT = 7200; // In seconds

let token;

class Fetcher {
    constructor() {
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        // console.log("Called fetcher constructor");

        this.success = 0;
        this.failure = 0;

        this.timer = setInterval(this.garbageCollector.bind(this), 300000);
    }

    async signin() {
        const url = `${REMOTE}login`;
        const data = {
            apikey: APIKEY
        };
        console.log("Heading to " + url);
        let response = await axios.post(url, data);
        if (response.status !== 200) {
            throw new Error(`Failed to get remote response ${response.status}`);
        }
        let body = response.data;
        console.log(body);
        token.content = body.token;
        cache.putToken(token.content);
        return body;
    }

    /** For fetch requests */
    getOpts() {
        return {
            headers: {
                'Authorization': `Bearer ${token.content}`,
                'Accept': 'application/json',
            }
        };
    }

    async refreshToken() {
        let url = "https://api.thetvdb.com/refresh_token";
        let response = await axios.get(url, this.getOpts());
        token.content = response.data.token;
        cache.putToken(token.content);
    }

    getCached(name) {
        const key = `${REMOTE}search/series?name=${encodeURIComponent(name)}`;
        return cache.get(key);
    }

    async getActors(showId) {
        const url = `${REMOTE}series/${showId}/actors`;
        // console.log("Getting actors", url);
        let response = await axios.get(url, this.getOpts());
        return response.data.data;
    }

    async getSeasons(showId) {
        const url = `${REMOTE}series/${showId}/episodes/summary`;
        let response = await axios.get(url, this.getOpts());
        let data = response.data.data;
        if (data.airedSeasons) {
            return {
                episodes: data.airedEpisodes,
                seasons: data.airedSeasons.reduce((a, b) => Math.max(a, b))
            }
        }
        if (data.dvdSeasons) {
            return {
                episodes: data.dvdEpisodes,
                seasons: data.dvdSeasons.reduce((a, b) => Math.max(a, b))
            }
        }
        return {
            episodes: 0,
            seasons: 0
        }
    }

    async getPosters(showId) {
        const url = `${REMOTE}series/${showId}/images/query?keyType=poster`;
        // console.log("Getting actors", url);
        let response = await axios.get(url, this.getOpts());
        let posters = response.data.data;
        posters = posters.map((poster) => `${REMOTE_PUBLIC}banners/${poster.thumbnail}`);
        return posters;
    }

    async show(name) {
        const url = `${REMOTE}search/series?name=${encodeURIComponent(name)}`;
        const urlExtra = `${REMOTE}series/`;
        let key = url;
        // Try cache first
        let data = cache.get(key);
        if (data) {
            // console.log(`Returning cached ${key}`);
            this.success++;
            return data.content;
        }

        // console.log(`Did not find ${key} in cache.`);
        try {
            const opts = this.getOpts();
            let response = await axios.get(url, opts);
            // We only want the first response right now, for brevity
            data = response.data.data.length ? response.data.data[0] : null;
            let showId = data.id
            // Get fuller data
            console.log("Extra url = ", urlExtra + showId);
            let extra = await axios.get(urlExtra + showId, opts);
            data = Object.assign(data, extra.data.data);
            data.actors = await this.getActors(showId);
            data.seasons = await this.getSeasons(showId);
            data.posters = await this.getPosters(showId);
            // console.log("final data", data);
            console.log("Cached " + url);
            cache.put(key, data, CACHE_DEFAULT);
            this.success++;
        } catch (e) {
            console.log(`Failed to fetch ${url}`, e.message);
            cache.put(key, {error: "No fetchy"}, CACHE_DEFAULT); // I will use this to remove entries from lists
            this.failure++;
            throw e;
        }

        return data;
    }

    listFromFile(filename) {
        let list = require(filename);
        return list;
    }

    /**
     * Checks that token is valid on each bloody request
     */
    async verifyValidToken(req, res, next) {
        // Get the token (notice the module variable, not class variable)
        token = cache.getToken();
        // console.log("Token = ", token);
        // Check expiration
        if (token && !token.expired) {
            console.log("Token is still good");
            return next(); // We're good
        }
        // Try refresh
        if (token.content) {
            try {
                console.log("Trying to refresh token.");
                await this.refreshToken();
                return next();
            } catch (e) {
                console.log("Refresh token failed");
            }
        }
        // Try full sign-in
        console.log("Doing sign-in");
        try {
            await this.signin();
            return next();
        } catch (e) {
            console.log("Sign in failed because", e);
            res.send(e.message);
            // throw new Error("Sign in failed, cannot perform actions!");
        }

    }

    /**
     * Run this periodically to remove old entries from the fucking db
     */
    garbageCollector() {
        cache.showGc();
    }
}

module.exports = {Fetcher};