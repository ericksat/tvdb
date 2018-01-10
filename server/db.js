const lowdb = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')
const adapter = process.env.NODE_ENV === 'production' ? new Memory() : new FileSync('db.json');

class DbCache {
    constructor() {
        this.db = lowdb(adapter);
        // Set some defaults
        this.db.defaults({ shows: [], episodes: [], suggestions: [], token: null }).write();
    }

    get(key, collection = "shows") {
        key = key.toLowerCase();
        // console.log(`Requesting ${key}`);
        let thingy = this.db.get(collection).find({ url: key }).value();
        if (!thingy) return null;
        if (thingy.expires < Date.now()) {
            console.log(`Found ${key} but expired`);
            this.db.get(collection).remove({url: key}).write();
            return null;
        }
        // console.log(`Found ${key} and returning`);
        return thingy;
    }

    put(key, content, expireSeconds, collection= "shows") {
        // console.log(`Storing ${key}`);
        let expires = Date.now() + (expireSeconds * 1000);
        this.db.get(collection).push({ url: key.toLowerCase(), content, expires }).write();
    }

    showGc() {
        let now = Date.now();
        this.db.get('shows').remove((item) => item.expires < now).write();
        console.log("Ran show garbage collector.");
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
        return this.db.get('suggestions').filter((one) => one.indexOf(filter) === 0).value();
    }

    addSuggestion(value) {
        this.db.get('suggestions').push(value).write();
    }
}

module.exports = new DbCache();