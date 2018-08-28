var request = require('request');

var access_token;

const YT_REDIRECT_URL = 'http://localhost:3000/auth/youtube/callback';
const YT_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token';
const YT_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const YT_PLAYLISTITEM_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YT_PLAYLIST_QUERY = 'https://www.googleapis.com/youtube/v3/playlists';
const YT_SCOPES = 'https://www.googleapis.com/auth/youtube';

const queryString = (obj) => Object.keys(obj).map(key => key + '=' + obj[key]).join('&');

/* Function that redirects in google auth */
youtubeAuth = (req, res) => {
  
  /* Object that contains data for auth */
  const queryParams = {
    auth_uri: YT_AUTH_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: YT_REDIRECT_URL,
    token_uri: YT_TOKEN_URL,
    scope: YT_SCOPES,
    response_type: 'code',
    show_dialog: true
  }
  
  /* Converting a object into a string query url safe */
  res.redirect(YT_AUTH_URL + '?' + queryString(queryParams));
}

/* Callback function called in a route */
youtubeCallback = (req, res) => {
  /* If there is an error we redirect to the root */
  if(req.query.error){
    res.redirect('/');
    throw err;
  }
  else{
    /* Process received data */
    var body = {
      response_type: 'token', 
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: YT_REDIRECT_URL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET
    }

    /* Send a post request to get an access token */
    request({
      url: YT_TOKEN_URL,
      method: "POST",
      form: body,
      json: true
    }, (err, resp, body) => saveTokenYoutube(res, err, resp, body));
  }
}

/* Callback function for store the token */
saveTokenYoutube = (res, err, response, body) => {
  access_token = body.access_token;
  res.redirect('/result');
}

/* Get all current user's playlists */
getPlaylists = (req, res) => {

  /* Request's body */
  const body = {
    part: 'snippet',
    mine: true
  }

  /* Request's header */
  const header = { 'Authorization': 'Bearer ' + access_token }

  /* Request's data */
  const options = {
    method: 'GET',
    uri: YT_PLAYLIST_QUERY + '?' + queryString(body),
    headers: header
  }

  /* HTTP GET request to YT_PLAYLIST_QUERY */
  request(options, (err, resp, body) => processPlaylists(res, err, resp, body));
}

processPlaylists = (res, err, resp, body) => {

  if(err) console.log(err);
  if(body.error != undefined) res.redirect('/');

  /* Initialize empty json */
  var playlists = {
    total: 0,
    items: []
  };

  var body = JSON.parse(body);
  
  /* Iterate every response's items field and append it */
  for(var i in body.items) {

    /* Increment counter */
    playlists.total += 1;

    /* Push obj */
    playlists.items.push({
      id: body.items[i].id,
      title: body.items[i].snippet.title
    });
  }

  res.send(playlists);
}


module.exports = {youtubeAuth, youtubeCallback, getPlaylists}