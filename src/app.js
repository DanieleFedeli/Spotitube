var spotify = require('./spotify');
var debug = require('debug')('my-namespace')
var youtube = require('./youtube');
var express = require('express');
var app = express();

const name = 'Spotitube'

debug('booting %s', name)

app.use(express.static(__dirname));

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');

/* HTTP routes definition */
app.get('/', (req, res) => res.render('home'));

app.get('/about', (req, res) => res.render('about'));

app.get('/auth/spotify', spotify.spotifyAuth);

app.get('/auth/youtube', youtube.youtubeAuth);

app.get('/auth/spotify/callback', spotify.spotifyCallback);

app.get('/auth/youtube/callback', youtube.youtubeCallback);

app.get('/result', (req, res) => res.render('result'));

/* Json comunication */
app.get('/youtubePlaylists', youtube.getPlaylists);

app.get('*', (req, res) => res.render('home'));

app.listen(3000);

