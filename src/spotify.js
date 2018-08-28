var request = require('request');

var access_token;
var refresh_token;

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize/';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_REDIRECT_URL = 'http://localhost:3000/auth/spotify/callback';

const SPOTIFY_SCOPES = 'user-library-read user-top-read playlist-read-private playlist-read-collaborative';

spotifyAuth = (req, res) => {
  /* Object that contains data for auth */
  const queryParams = {
    client_id: process.env.SPOTIFY_CLIENT_ID,
    redirect_uri: SPOTIFY_REDIRECT_URL,
    scope: SPOTIFY_SCOPES,
    response_type: 'code',
    show_dialog: true
  }

  /* Converting a object into a string query url safe */
  var queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
  res.redirect(SPOTIFY_AUTH_URL + '?' + queryString);
}

spotifyCallback = (req, res) => {
  /* If there is an error we redirect to the root */
  if(req.query.error){
    res.redirect('/');
    throw err;
  }
  else{
    /* Process received data */
    var body = {
      redirect_uri: SPOTIFY_REDIRECT_URL,
      grant_type: 'authorization_code',
      code: req.query.code,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    }

    /* Send a post request to get an access token */
    request({
      url: SPOTIFY_TOKEN_URL,
      method: "POST",
      form: body
    }, saveTokenSpotify);

    res.redirect('/auth/youtube');
  }
}

/* Callback function for store the token */
saveTokenSpotify = (err, res, body) => {
  access_token = body.access_token;
  refresh_token = body.refresh_token;
}

module.exports = {spotifyAuth, spotifyCallback};
