window.onload = function() {
  loggedIn();
  run();
}

// When the login button is pressed this function will set some sessionStorage items
function logInF() {
  sessionStorage.setItem('loggedIn', 'true');
  sessionStorage.setItem('timeRangeA', 'medium_term');
  sessionStorage.setItem('timeRangeS', 'medium_term');
  loggedIn();
}

// A check to see if the login button has been pressed or not
function loggedIn() {
  let logSess = sessionStorage.getItem('loggedIn');
  if (logSess == 'true') {
    let logInScreenDiv = document.getElementById('logInScreenDiv');
    let loggedInScreenDiv = document.getElementById('loggedInScreenDiv');
    logInScreenDiv.style.display = 'none';
    loggedInScreenDiv.style.display = 'block';
  } else {
    sessionStorage.setItem('loggedIn', 'false');
  }
}


// Jquery, when the refresh button is clicked, click the login button to refresh the token
$('#refresh').click(function() {
  $('#clickMe').click();
});

// When scrollD button is clicked, scroll down
$('#scrollD').click(function() {
  scrollTo({
    top: 732,
    left: 0,
    behavior: 'smooth'
  });
});

// When scrollU button is clicked, scroll up
$('#scrollU').click(function() {
  scrollTo({
    top: -732,
    left: 0,
    behavior: 'smooth'
  });
});

// Checks for when dropdown buttons are pressed reload the page with the new info
$('#shortTermA').click(function() {
  sessionStorage.setItem('timeRangeA', 'short_term');
  location.reload();
});
$('#mediumTermA').click(function() {
  sessionStorage.setItem('timeRangeA', 'medium_term');
  location.reload();
});
$('#longTermA').click(function() {
  sessionStorage.setItem('timeRangeA', 'long_term');
  location.reload();
});
$('#shortTermS').click(function() {
  sessionStorage.setItem('timeRangeS', 'short_term');
  location.reload();
});
$('#mediumTermS').click(function() {
  sessionStorage.setItem('timeRangeS', 'medium_term');
  location.reload();
});
$('#longTermS').click(function() {
  sessionStorage.setItem('timeRangeS', 'long_term');
  location.reload();
});

let searchVis = false;


function run() {
  (function() {

    // Get the url and its access token
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
      while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    var params = getHashParams();

    var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

    // Get the dropdown button that has been pressed from the above Jquery
    var timeRangeA = sessionStorage.getItem('timeRangeA');
    var timeRangeS = sessionStorage.getItem('timeRangeS');



    if (error) {
      alert('There was an error during the authentication');
    } else {
      if (access_token) {

        // Get the users profile info: id and the link to their profile
        $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            var res = JSON.stringify(response.id, null, 2);
            var resL = JSON.stringify(response.external_urls.spotify, null, 2);
            var reg = /"(.*?)"/;
            res = reg.exec(res);
            resL = reg.exec(resL);
            res = res[1];
            resL = resL[1];
            document.getElementById('userNameBox').innerHTML = res;
            document.getElementById('userNameBox').href = resL;
          }
        });

        // Run currently here
        currently();
        // After first run, run it every second after
        setInterval(function() {
          currently();
        }, 1000);

        function currently() {
          // Get the users current playing track, artist, duration, current position and whether it is paused
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player/currently-playing' +
              '?market=GB',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
              var res = JSON.stringify(response.item.name, null, 2);
              var resL = JSON.stringify(response.item.external_urls.spotify, null, 2);
              var resA = JSON.stringify(response.item.artists["0"].name);
              var sLength = JSON.stringify(response.item.duration_ms);
              var sPos = JSON.stringify(response.progress_ms);
              var playing = JSON.stringify(response.is_playing);
              var sCover = JSON.stringify(response.item.album.images["1"].url);
              sessionStorage.setItem('playing', playing);
              var reg = /"(.*?)"/;
              res = reg.exec(res);
              resL = reg.exec(resL);
              resA = reg.exec(resA);
              sCover = reg.exec(sCover);
              res = res[1];
              resL = resL[1];
              resA = resA[1];
              sCover = sCover[1];
              document.getElementById('currentPlayingTrack').innerHTML = '<b>Currently Playing: </b>' + resA + ' - ' + res;
              document.getElementById('currentPlayingTrackX').value = resA;
              document.getElementById('currentPlayingTrackY').value = res;
              document.getElementById('currentPlayingTrack').href = resL;
              document.getElementById('sliderSong').max = sLength;
              document.getElementById('sliderSong').value = sPos;
              // document.getElementById('albumCover').src = sCover;
            }
          });
        }

        // Get users top 5 artists
        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/artists' +
            '?time_range=' + timeRangeA + '&limit=5&offset=0',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            for (var i = 0; i < response.items.length; i++) {
              var res = JSON.stringify(response.items[i].name, null, 2);
              var resL = JSON.stringify(response.items[i].external_urls.spotify, null, 2);
              var reg = /"(.*?)"/;
              res = reg.exec(res);
              resL = reg.exec(resL);
              res = res[1];
              resL = resL[1];
              document.getElementById('artist' + [i]).innerHTML = res;
              document.getElementById('artist' + [i]).href = resL;
            }
          }
        });

        // Get users top 5 tracks
        $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks' +
            '?time_range=' + timeRangeS + '&limit=5&offset=0',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            for (var i = 0; i < response.items.length; i++) {
              var res = JSON.stringify(response.items[i].name, null, 2);
              var resA = JSON.stringify(response.items[i].artists['0'].name)
              var resL = JSON.stringify(response.items[i].external_urls.spotify, null, 2);
              var reg = /"(.*?)"/;
              res = reg.exec(res);
              resA = reg.exec(resA);
              resL = reg.exec(resL);
              res = res[1];
              resA = resA[1];
              resL = resL[1];
              document.getElementById('song' + [i]).innerHTML = resA + ' - ' + res;
              document.getElementById('song' + [i]).href = resL;
            }
          }
        });

        // Watch play/pause button for a click
        $('#playButton').click(function() {
          // get playing info form sessionStorage which is set by the currently function
          var playing = sessionStorage.getItem('playing');
          if (playing == 'false') {
            // If it's not playing make it play/resume
            $.ajax({
              url: 'https://api.spotify.com/v1/me/player/play',
              type: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {}
            });
            // set playing to true
            sessionStorage.setItem('playing', 'true');
          } else if (playing == 'true') {
            // If it's playing then pause it
            $.ajax({
              url: 'https://api.spotify.com/v1/me/player/pause',
              type: 'PUT',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {}
            });
            // set playing to false
            sessionStorage.setItem('playing', 'false');
          }
        });

        // skip to next track
        $('#nextButton').click(function() {
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player/next',
            type: 'POST',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {}
          });
        });
        // skip to previous track
        $('#previousButton').click(function() {
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player/previous',
            type: 'POST',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {}
          });
        });

        $('#searchText').keypress((event) => {
          if (event.which === 13) {
            let searchIn = $('#searchText').val();
            const list = document.getElementById('results');
            let reg = /"(.*?)"/;
            $.ajax({
              url: 'https://api.spotify.com/v1/search?q=' +
                searchIn +
                '&type=track%2Cartist%2Calbum&limit=10',
              type: 'GET',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                // TODO: add links to the results so the user can choose one, then when results is closed clear all li tags
                try {
                  for (i = 0; i < 3; i++) {
                    const li = document.createElement("li");
                    const hr = document.createElement("a");
                    let y = JSON.stringify(response.artists.items[i].name);
                    let w = JSON.stringify(response.artists.items[i].external_urls.spotify);
                    y = reg.exec(y);
                    w = reg.exec(w);
                    y = y[1];
                    w = w[1];
                    hr.innerHTML = y + ' (artist)';
                    hr.href = w;
                    hr.target = "_blank";
                    li.innerHTML = hr;
                    // li.innerHTML = y + ' (artist)';
                    li.replaceChild(hr, li.childNodes[0]);
                    list.appendChild(li);
                  }
                } catch (err) {
                  console.log('error');
                }
                try {
                  for (i = 0; i < 3; i++) {
                    const li = document.createElement("li");
                    const hr = document.createElement("a");
                    let y = JSON.stringify(response.tracks.items[i].name);
                    let z = JSON.stringify(response.tracks.items[i].artists[0].name);
                    let w = JSON.stringify(response.tracks.items[i].external_urls.spotify);
                    y = reg.exec(y);
                    z = reg.exec(z);
                    w = reg.exec(w);
                    y = y[1];
                    z = z[1];
                    w = w[1];
                    hr.innerHTML = z + ' - ' + y + ' (track)';
                    hr.href = w;
                    hr.target = "_blank";
                    li.innerHTML = hr;
                    // li.innerHTML = z + ' - ' + y + ' (track)';
                    li.replaceChild(hr, li.childNodes[0]);
                    list.appendChild(li);
                  }
                } catch (err) {
                  console.log('error');
                }
                try {
                  for (i = 0; i < 3; i++) {
                    const li = document.createElement("li");
                    const hr = document.createElement("a");
                    let y = JSON.stringify(response.albums.items[i].name);
                    let z = JSON.stringify(response.albums.items[i].artists[0].name);
                    let w = JSON.stringify(response.albums.items[i].external_urls.spotify)
                    y = reg.exec(y);
                    z = reg.exec(z);
                    w = reg.exec(w);
                    y = y[1];
                    z = z[1];
                    w = w[1];
                    hr.innerHTML = z + ' - ' + y + ' (album)';
                    hr.href = w;
                    hr.target = "_blank";
                    li.innerHTML = hr;
                    // li.innerHTML = z + ' - ' + y + ' (album)';
                    li.replaceChild(hr, li.childNodes[0]);
                    list.appendChild(li);
                  }
                } catch (err) {
                  console.log('error');
                }
              }
            });
          }
        });

        // A fade in and out for the loved tracks, I thought it was too ugly to always be there
        $('#loveButton').mouseover(function() {
          $('#lovedList').fadeIn(500, () => {
            $('#lovedList').delay(5000), $('#lovedList').fadeOut(500);
          });
        });

        // A button to add the current track to a list
        $('#loveButton').click(function() {
          let track = document.getElementById('currentPlayingTrackY').value;
          let artist = document.getElementById('currentPlayingTrackX').value;
          let song = '"' + artist + ' - ' + track + '"' + ', ';
          let arr = localStorage.getItem('lovedTracks');
          localStorage.setItem('lovedTracks', arr + song);
          let lovedTracks = localStorage.getItem('lovedTracks');
          lovedTracks = lovedTracks.split(', ');
          displayLovedSongs(lovedTracks);
        });

        displayLovedSongsStart();

        function displayLovedSongsStart() {
          let lovedTracks = localStorage.getItem('lovedTracks');

          let re = /\B"+(.*?)"/g;
          lovedTracks = lovedTracks.match(re);

          let reg = /\B"+(.*?)"/;
          for (i = 0; i < lovedTracks.length; i++) {
            lovedTemp = reg.exec(lovedTracks[i]);
            lovedTracks[i] = lovedTemp[1];
            let lovedList = document.getElementById('lovedList');
            let str = lovedTracks[i];
            let titleStr = str.replace(/\s/g, '');
            lovedList.insertAdjacentHTML('beforeend', '<li title=' + titleStr + '>' + lovedTracks[i] + '</li>');
          }
        }

        function displayLovedSongs(lovedTracks) {
          let lovedList = document.getElementById('lovedList');
          let i = lovedTracks.length - 2;
          let re = /\B"+(.*?)"/;
          let displayTrack = re.exec(lovedTracks[i]);
          displayTrack = displayTrack[1];
          let titleStr = displayTrack.replace(/\s/g, '');
          lovedList.insertAdjacentHTML('beforeend', '<li title=' + titleStr + '>' + displayTrack + '</li>');
        }

        //Search for a song, artist or album
        $('#searchB').click(() => {
          if (searchVis == false) {
            $('#search_popup').css({
              visibility: 'visible'
            });
            $('#searchText').focus();
            searchVis = true;
          } else if (searchVis == true) {
            $('#search_popup').css({
              visibility: 'hidden'
            });
            let results = document.getElementById('results');
            while (results.firstChild) {
              results.removeChild(results.firstChild);
            };
            $('#searchText').val('');
            searchVis = false;
          }
        });

        //Volume slider
        $('#slider').change(function() {
          var volume = document.getElementById('slider').value;
          sessionStorage.setItem('volume', volume);
          // set volume as value from slider
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player/volume' +
              '?volume_percent=' + volume,
            type: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {}
          });
        });

        // Song timeline, when mouseup from moving the slider do:
        $('#sliderSong').mouseup(function() {
          var sPos = document.getElementById('sliderSong').value;
          // Get the value of the slider (position in song) and seek to it
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player/seek' +
              '?position_ms=' + sPos,
            type: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {}
          });
        });
      }
    }
  })();
}