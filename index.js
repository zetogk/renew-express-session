'use strict';

const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');

const { log } = console;

const app = express();

app.use(session({
    secret: 'SECR1524361234d*',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        expires: 15000
    }
}));

app.use(function (req, res, next) {

    if (req.session.sessionID === undefined) {

        req.session.sessionID = uuid();
        log(`Session ID created: ${req.session.sessionID} at ${Date.now()}`);

    } else {

        log(`Session ID ${req.session.sessionID}`);

    }

    next();
})

app.get('/', function (req, res) {

    res.sendFile(`${__dirname}/static/web1.html`);

})

app.get('/one', function (req, res) {

    res.sendFile(`${__dirname}/static/web1.html`);

})

app.get('/two', function (req, res) {

    res.sendFile(`${__dirname}/static/web2.html`);

})

const port = 3000 || process.env.PORT;

app.listen(port, () => log(`PORT: ${port}`))
