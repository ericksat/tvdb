const lowdb = require('lowdb');

const FileAdapter = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')
const adapter = process.env.NODE_ENV === 'production' ? new Memory() : new FileAdapter('db.json');

class DbManager {
    constructor() {
        this.db = lowdb(adapter);
        // Set some defaults
        this.db.defaults({ shows: [], episodes: [], suggestions: [], search: [], token: null }).write();
    }

    get(key, collection = "shows") {
        key = key.trim().toLowerCase();
        // console.log(`Requesting ${key}`);
        let thingy = this.db.get(collection).find({ id: key }).value();
        if (!thingy) return null;
        if (thingy.expires < Date.now()) {
            console.log(`Found ${key} but expired`);
            this.db.get(collection).remove({id: key}).write();
            return null;
        }
        // console.log(`Found ${key} and returning`);
        return thingy;
    }

    put(key, content, expireSeconds, collectionName = "shows") {
        console.log(`Storing ${key} in ${collectionName}`);
        const expires = Date.now() + (expireSeconds * 1000);
        key = key.trim().toLowerCase();

        // console.log(content);

        const collection = this.db.get(collectionName);
        const exists = collection.find({ id: key }).value();
        if (exists) {
            // collection.remove({ id: key }).write();
            collection.find({ id: key }).assign({ content, expires }).write();
        } else {
            collection.push({ id: key, content, expires }).write();
        }
    }

    runGarbageCollector() {
        let now = Date.now();
        this.db.get('shows').remove((item) => item.expires < now).write();
        this.db.get('search').remove((item) => item.expires < now).write();
        console.log("Ran garbage collector.");
    }

    getToken() {
        let token = this.db.get('token').value();
        if (token == null) {
            token = {
                content: "",
                expires: 0
            }
        }
        token.expired = token.expires < Date.now();
        // console.log(`Token expiration ${token.expires} vs now ${Date.now()}`)
        return token;
    }

    putToken(content, expireSeconds = 86400) {
        console.log("Pushing token");
        let token  = {
            content,
            expires: Date.now() + (expireSeconds * 1000)
        }
        this.db.set('token', token).write()
    }

    getSuggestions(filter) {
        if (!filter) {
            return this.db.get('suggestions').value();
        } // Else filter
        return this.db.get('suggestions').filter((one) => one.indexOf(filter) === 0).value();
    }

    addSuggestion(value) {
        // Make sure it doesn't exist yet
        let collection = this.db.get('suggestions');
        let exist = collection.filter((one) => one === value).size().value();
        // console.log(exist);
        if (!exist) {
            // console.log("Adding suggestion " + value);
            collection.push(value).write();
        }
    }

/*    getByAlias(alias) {
        alias = alias.toLowerCase();
        // console.log(`Requesting ${key}`);
        let allShows = this.db.get("shows").value();
        for (let show of allShows) {
            if (!show.content.aliases || show.content.aliases.length === 0) continue;
            for (let item of show.content.aliases) {
                if (item.toLowerCase() === alias) {
                    if (show.expires < Date.now()) {
                        console.log(`Found alias ${alias} but expired`);
                        this.db.get("shows").remove({ url: show.url }).write();
                        return null;
                    } else {
                        console.log(`Found alias ${alias}.`);
                        return show;
                    }
                }
            }
        }
        // Did not find alias
        return null;
    } */

    updateIndex(key, value) {
        // See if exists
        key = key.trim().toLowerCase();
        this.db.set(`showsIndex[${key}]`, value).write();
    }

    getIndex(key) {
        key = key.trim().toLowerCase();
        return this.db.get(`showsIndex[${key}]`).value() || null;
    }
}

module.exports = new DbManager();