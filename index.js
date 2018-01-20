'use strict';

const colors = require('colors');
const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');

const { log } = console;

const app = express();

app.use(session({
    secret: 'my*secret-',
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 900000
    },
    rolling: true
}));

app.use(function (req, res, next) {

    if (req.session.sessionID === undefined && !req.app.get('logged')) {

        req.session.sessionID = uuid();
        req.app.set('logged', true);
        log(`Session ID created: ${req.session.sessionID} at ${new Date(Date.now())} - ${req.session.cookie.expires}`.yellow);

    } else if (req.session.sessionID === undefined && req.app.get('logged')) {

        log(`Error - Logged. But, there is not session id at ${new Date(Date.now())} - ${req.session.cookie.expires}`.red);
        res.status(500).json({ error: `Logged. But, there is not session id at ${new Date(Date.now())}`});

    }  else {

        log(`Session ID -------: ${req.session.sessionID} at ${new Date(Date.now())}`.green);
        req.session.sessionID = req.session.sessionID;

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
