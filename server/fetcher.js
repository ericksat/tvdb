const axios = require('axios');
const db = require('./db');
const fs = require('fs');

const APIKEY = 'F23C95D5D38FE20E';
const REMOTE = 'https://api.thetvdb.com/';
const REMOTE_ARTWORK = 'https://artworks.thetvdb.com/';
const CACHE_DEFAULT = 3600 * 24; // In seconds

let token;

class BadApiError extends Error {

}

function pick(src, props) {
    // Make sure object and properties are provided
    if (!src || !props) return;
    // Create new object
    const picked = {};
    // Loop through props and push to new object
    props.forEach(prop => picked[prop] = src[prop]);
    // Return new object
    return picked;
}

class Fetcher {
    constructor() {
        axios.defaults.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        // console.log("Called fetcher constructor");
        this.timer = setInterval(this.garbageCollector.bind(this), 900000);
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
        db.putToken(token.content);
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
        db.putToken(token.content);
    }

    getCached(name) {
        try {
            // const key = `${REMOTE}search/series?name=${encodeURIComponent(name)}`;
            let key = name.trim().toLowerCase();
            // Check in index
            let indexedKey = db.getIndex(key);
            if (indexedKey) {
                // console.log("Returning indexed key " + indexedKey);
                return db.get(indexedKey);
            }
            return db.get(key);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * Keys a show and its aliases into cache and index
     *
     * @param {Array} data
     */
    putInCache(name, data) {
        // console.log("Putting in cache");
        if (data.error) {
            db.put(name.trim().toLowerCase(), data, CACHE_DEFAULT);
        }
        try {
            let key = data.seriesName ? data.seriesName.trim().toLowerCase() : name.trim().toLowerCase();
            // console.log("Putting some key " + key);
            db.put(key, data, CACHE_DEFAULT);
            // console.log("Now indexes");
            // Update index
            let indexEntries = [name];
            if (data.aliases && data.aliases.length > 0) {
                for (let alias of data.aliases) {
                    indexEntries.push(alias);
                }
            }
            // Insert or replace all values in index
            for (let entry of indexEntries) {
                db.updateIndex(entry, key);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getActors(showId) {
        const url = `${REMOTE}series/${showId}/actors`;
        // console.log("Getting actors", url);
        let response = await axios.get(url, this.getOpts());
        let actors = response.data.data;
        return actors.map(actor => {
            return {
                id: actor.id,
                image: actor.image ? `${REMOTE_ARTWORK}banners/${actor.image}` : "/img/logo.png",
                name: actor.name,
                role: actor.role,
                sortOrder: actor.sortOrder
            };
        }).sort((a, b) => {
            return a.sortOrder - b.sortOrder;
        });
    }

    async getSeasons(showId) {
        const url = `${REMOTE}series/${showId}/episodes/summary`;
        let response = await axios.get(url, this.getOpts());
        let data = response.data.data;
        if (data.airedSeasons && data.airedSeasons.length > 0) {
            return {
                episodes: data.airedEpisodes,
                seasons: data.airedSeasons.reduce((a, b) => Math.max(a, b))
            }
        }
        if (data.dvdSeasons && data.dvdSeasons.length > 0) {
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
        posters = posters.map((poster) => `${REMOTE_ARTWORK}banners/${poster.thumbnail}`);
        return posters;
    }

    async search(query) {
        // Try cache first
        // let data = this.getCached(query);
        // if (data) {
        //     console.log(`Returning cached ${query}`);
        //     db.addSuggestion(query.trim()); // A successful result will be used in future suggestions
        //     return data.content;
        // }
        // console.log(`Did not find ${name} in db.`);

        // Go to remote
        const url = `${REMOTE}search/series?name=${encodeURIComponent(query)}`;
        try {
            const opts = this.getOpts();
            // console.log("Contacting remote " + url);
            let response = await axios.get(url, opts);
            // console.log("Managed to get response");
            //  console.log(response.data.data);
            // We only want the first response right now, for brevity
            const data = response.data.data.map((item) => {
                item = pick(item, ['id', 'seriesName', 'image', 'status', 'firstAired']);
                item.image = `${REMOTE_ARTWORK}${item.image}`.replace(/\/\//g, "/");
                return item;
            });

            // console.log("final data", data);
            this.putInCache(query, data);
            // console.log("Cached, adding suggestion");
            db.addSuggestion(query.trim()); // A successful result will be used in future suggestions
            return data;
        } catch (e) {
            console.log(`Failed to fetch ${url}`, e.message, e.stack);
            if (e.message.indexOf('code 404') !== -1) {
                let errText = `Could not find any TV show matching ${query}`;
                this.putInCache(query, {error: errText}); // Keeping this result in cache would save on useless future searches
                throw new Error(errText);
            }
            throw e;
        }
    }

    async show(showId) {
        // Try cache first
        const cacheKey = `show_${showId}`;
        let data = null; // this.getCached(cacheKey);
        if (data) {
            console.log(`Returning cached ${cacheKey}`);
            return data.content;
        }
        // console.log(`Did not find ${name} in db.`);

        // Go to remote
        const url = `${REMOTE}series/${showId}`;
        try {
            const opts = this.getOpts();
            // console.log("Contacting remote " + url);
            let response = await axios.get(url, opts);
            // console.log(response.data);

            // Pick only certain properties
            data = pick(response.data.data, [
                'id', 'banner', 'firstAired', 'aliases', 'image', 'network', 'overview',
                'seriesName', 'status', 'genre', 'rating', 'siteRating'
            ]);

            if (!data.seriesName) throw BadApiError();

            // Add ours
            try {
                data.actors = await this.getActors(showId);
                data.seasons = await this.getSeasons(showId);
                data.posters = await this.getPosters(showId);
            } catch (e) {
                console.log(`Failed to get additional data for ${showId}`);
                throw new BadApiError();
            }

            data.banner = `${REMOTE_ARTWORK}banners/${data.banner}`;

            // console.log("final data", data);
            this.putInCache(cacheKey, data);
            return data;
        } catch (e) {
            if (e instanceof BadApiError) {
                console.log(`${url} doesn't fit the old API`);
                throw Error("This show uses the new, paid-for API");
            }

            console.log(`Failed to fetch ${url}`, e.message, e.stack);
            if (e.message.indexOf('code 404') !== -1) {
                let errText = `Could not find any TV show matching ${query}`;
                throw new Error(errText);
            }
            throw e;
        }
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
        token = db.getToken();
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

    async fetchEpisodes(showId, season) {
        const url = `${REMOTE}series/${showId}/episodes/query?airedSeason=${season}`;
        let key = `${showId}_episodes_${season}`
        // Try cache first
        let data = db.get(key, "episodes");
        if (data) {
            console.log(`Returning cached ${key}`);
            return data.content;
        }

        // console.log("Getting actors", url);
        let response = await axios.get(url, this.getOpts());
        let episodes = response.data.data;
        episodes = episodes.map((item) => pick(item, ["id", "absoluteNumber", "contentRating", "episodeName", "firstAired", "overview"]))
        episodes.sort((a, b) => a.absoluteNumber - b.absoluteNumber);

        db.put(key, episodes, CACHE_DEFAULT, 'episodes');
        return episodes;
    }

    /**
     * Run this periodically to remove old entries from the fucking db
     */
    garbageCollector() {
        db.showGc();
    }

    fetchSuggestions(filter) {
        return db.getSuggestions(filter)
    }
}

module.exports = {Fetcher};