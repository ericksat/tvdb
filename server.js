// TODO: Improve show-index related code to be more readable, less repeats of trim-tolowercase
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
    // const webpack = require('webpack');
    // const middleware = require('webpack-dev-middleware');
    // const webpackConfig = require('./webpack.config.js');
    // const compiler = webpack(webpackConfig);
    // app.use(middleware(compiler, {
    //     publicPath: webpackConfig.output.publicPath,
    // }));
    // const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    //     log: false,
    // });
    // app.use(hotMiddleware);

    app.use((req, res, next) => {
        res.setHeader('access-control-allow-origin', '*');
        next();
    });
}

// Static routes
// app.use(express.static(path.join(__dirname, './src/assets')));
// if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './dist')));
// }

// Verify login status
app.use(fetcher.verifyValidToken.bind(fetcher));

app.get('/api/show/:id', async (req, res) => {
    try {
        let fetchRes = await fetcher.show(req.params.id);
        res.send(fetchRes);
    } catch (e) {
        // I don't feel like messing with imports now
        if (e.message.indexOf("paid-for API") !== -1) {
            res.status(200).send({ success: false, error: e.message });
        } else {
            res.send({ success: false, error: e.message });
        }
    }
});

app.get('/api/search/:query', async (req, res) => {
    try {
        let fetchRes = await fetcher.search(req.params.query, req.query.save === "true");
        res.send(fetchRes);
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

app.get('/api/episodes/:id/:season', async (req, res) => {
    try {
        let fetchRes = await fetcher.fetchEpisodes(req.params.id, req.params.season);
        if (!fetchRes || fetchRes.length === 0) throw Error('Bad result or no results.');
        res.send({ success: true, episodes: fetchRes });
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

// app.get('/api/suggestions/:query', (req, res) => {
//     let suggestions = fetcher.fetchSuggestions(req.params.query.trim());
//     res.send({success: true, suggestions});
// });

// app.get('/api/suggestions', (req, res) => {
//     let suggestions = fetcher.fetchSuggestions();
//     res.send({ success: true, suggestions });
// });

app.get('/api/login', async (req, res) => {
    try {
        let fetchRes = await fetcher.signin();
        res.send(fetchRes);
    } catch (e) {
        res.send({ success: false, error: e.message });
    }
});

// Final catch all
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});