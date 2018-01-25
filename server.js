// TODO: db "cache" name should be changed to something that better defines it.
// TODO: Improve search by alias and seriesname through an index that maps them to proper keys (not just url as key)
// TODO: Final design update.

// process.env.NODE_ENV = 'production';
// console.log(process.env.NODE_ENV);

const express = require('express');
const path = require('path');
const app = express();

const { Fetcher } = require('./server/fetcher');
let fetcher = new Fetcher();

const port = process.env.PORT || 3000;

// Hotloader for test environment
if (process.env.NODE_ENV !== 'production') {
    const webpack = require('webpack');
    const middleware = require('webpack-dev-middleware');
    const webpackConfig = require('./webpack.config.js');
    const compiler = webpack(webpackConfig);
    app.use(middleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    }));
    const hotMiddleware = require('webpack-hot-middleware')(compiler);
    app.use(hotMiddleware);
}

// Static routes
app.use(express.static(path.join(__dirname, './src/assets')));
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './dist')));
}

// Verify login status
app.use(fetcher.verifyValidToken.bind(fetcher));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/show/:name', async (req, res) => {
    try {
        let fetchRes = await fetcher.show(req.params.name);
        res.send(fetchRes);
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

app.get('/episodes/:id/:season', async (req, res) => {
    try {
        let fetchRes = await fetcher.fetchEpisodes(req.params.id, req.params.season);
        if (!fetchRes || fetchRes.length === 0) throw Error('Bad result or no results.');
        res.send({ success: true, episodes: fetchRes });
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

app.get('/suggestions/:query', (req, res) => {
    let suggestions = fetcher.fetchSuggestions(req.params.query.trim());
    res.send({success: true, suggestions});
});

app.get('/suggestions', (req, res) => {
    let suggestions = fetcher.fetchSuggestions();
    res.send({ success: true, suggestions });
});

app.get('/login', async (req, res) => {
    try {
        let fetchRes = await fetcher.signin();
        res.send(fetchRes);
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});