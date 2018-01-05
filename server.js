// TODO: Proper loader
// TODO: The whole panel moves a bit sometimes when you click on different tabs. Fix that.
// TODO: Final design update.
// TODO: Cache keys should take aliases into consideration to reduce doubles.
// TODO: Heroku

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const compiler = webpack(webpackConfig);
const express = require('express');
const path = require('path');
const app = express();

// Local development
const { Fetcher } = require('./server/fetcher');
let fetcher = new Fetcher();

const port = process.env.port || 3000;

app.use(middleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
const hotMiddleware = require('webpack-hot-middleware')(compiler);
app.use(hotMiddleware);

// Static routes
const publicPath = path.join(__dirname, './src/assets');
app.use(express.static(publicPath));

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