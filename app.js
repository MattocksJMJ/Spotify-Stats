// A spotify app that displays a user's top songs, top albums and recommends songs based on the top songs.
// ALso includes a player that cna control spotify and search spotify for artists, albums, tracks and playlists.
// Jamie Mattocks

var express = require('express');
var app = express();
var request = require('request');
var querystring = require('querystring');
var fs = require('fs');

var client_id = ''; // CLIENT ID
var redirect_uri = ''; // REDIRECT URI - SET ON SPOTIFY DASHBOARD
var client_secret = ''; // SECRET ID
var scope = 'user-read-private user-top-read user-read-currently-playing user-read-private user-modify-playback-state'; // SCOPES WHICH WILL BE QUERYED

//SET RENDERER TO EJS
app.set('view engine', 'ejs');
//RETREIVE STYLES AND JS
app.use(express.static('static'))


//LOG IN PAGE
app.get('/', function(req, res) {
  console.log('requested: ' + req.url);
  res.render('index');
});

// WHEN BUTTON PRESSED ON LOGIN REDIRECT TO LOGIN SCREEN
app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    'client_id=' + client_id +
    '&response_type=' + 'code' +
    '&redirect_uri=' + redirect_uri +
    '&scope=' + scope);
});
// AFTER LOGGED IN CALLBACK TO HERE
app.get('/callback', function(req, res) {
  var re = /callback+(\S+)/;
  var match = re.exec(req.url);
  match = match[1];

  var newRe = /code=+(\S+)\b/;
  var code = newRe.exec(req.url);
  code = code[1];
  // IF THE CALLBACK FAILED DISPLAY 404
  if (match == '?error=access_denied&state=STATE') {
    res.render('404');
  } else {
    // IF CALLBACK SUCCEEDS
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri
      },
      headers: {
        Authorization: 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    }
    //  REQUEST A QUERY PAGE
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        // TOP ARTISTS QUERY
        var options = {
          url: 'https://api.spotify.com/v1/me/top/artists' +
            '?time_range=medium_term&limit=5&offset=0',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };

        request.get(options, function(error, res, body) {
          // prints response as a json file
          fs.writeFile('static/text/topArtists.json', JSON.stringify(body, null, 2), 'utf-8', (err) => {
            if (err) throw err;
          });
          // console.log(body);
        });

        // User ID Query
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };

        request.get(options, function(error, res, body) {
          // prints response as a json file
          fs.writeFile('static/text/userProfile.json', JSON.stringify(body, null, 2), 'utf-8', (err) => {
            if (err) throw err;
          });
          // console.log(body);
        });

        // TOP TRACKS QUERY
        var options = {
          url: 'https://api.spotify.com/v1/me/top/tracks' +
            '?time_range=medium_term&limit=5&offset=0',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };

        request.get(options, function(error, res, body) {
          // console.log(body);
          // prints response as a json file
          fs.writeFile('static/text/topTracks.json', JSON.stringify(body, null, 2), 'utf-8', (err) => {
            if (err) throw err;
          });
        });
        //  CURRENTLY PLAYING QUERY
        var options = {
          url: 'https://api.spotify.com/v1/me/player/currently-playing' +
            '?market=GB',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };

        request.get(options, function(error, res, body) {
          // console.log(body);
          // prints response as a json file
          fs.writeFile('static/text/currentPlayingTrack.json', JSON.stringify(body, null, 2), 'utf-8', (err) => {
            if (err) throw err;
          });
        });

        // REDIRECT AFTER QUERY
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


console.log('Listening to 8080');
app.listen(8080);









//