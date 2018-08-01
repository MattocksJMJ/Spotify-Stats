window.onload = function(){
 loggedIn();
}

function logInF() {
  sessionStorage.setItem('loggedIn', 'true');
  loggedIn();
  sessionStorage.setItem('timeRangeA', 'medium_term');
  sessionStorage.setItem('timeRangeS', 'medium_term');
}

function loggedIn() {
  let logSess = sessionStorage.getItem('loggedIn');
  if (logSess == 'true'){
    let logInScreenDiv = document.getElementById('logInScreenDiv');
    let loggedInScreenDiv = document.getElementById('loggedInScreenDiv');
    logInScreenDiv.style.display = 'none';
    loggedInScreenDiv.style.display = 'block';
    run();
  }
  else{sessionStorage.setItem('loggedIn', 'false');}
}

setInterval(function() {
   run(); }, 1000);


$('#scrollD').click(function(){
  scrollTo({
    top: 732,
    left: 0,
    behavior: 'smooth'
  });
});

$('#scrollU').click(function(){
  scrollTo({
    top: -732,
    left: 0,
    behavior: 'smooth'
  });
});

$('#shortTermA').click(function(){
  sessionStorage.setItem('timeRangeA', 'short_term');
  location.reload();
});
$('#mediumTermA').click(function(){
  sessionStorage.setItem('timeRangeA', 'medium_term');
  location.reload();
});
$('#longTermA').click(function(){
  sessionStorage.setItem('timeRangeA', 'long_term');
  location.reload();
});
$('#shortTermS').click(function(){
  sessionStorage.setItem('timeRangeS', 'short_term');
  location.reload();
});
$('#mediumTermS').click(function(){
  sessionStorage.setItem('timeRangeS', 'medium_term');
  location.reload();
});
$('#longTermS').click(function(){
  sessionStorage.setItem('timeRangeS', 'long_term');
  location.reload();
});

function run(){
(function() {

  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;
  var timeRangeA = sessionStorage.getItem('timeRangeA');
  var timeRangeS = sessionStorage.getItem('timeRangeS');

      if (error) {
        alert('There was an error during the authentication');
      } else {
        if (access_token) {
          $.ajax({url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization' : 'Bearer ' + access_token},
                success: function(response) {
                  var res = JSON.stringify(response.id , null, 2);
                 var resL = JSON.stringify(response.external_urls.spotify , null, 2);
                  var reg = /"(.*?)"/;
                      res = reg.exec(res);
                     resL = reg.exec(resL);
                      res = res[1];
                      resL = resL[1];
                  document.getElementById('userNameBox').innerHTML = res;
                  document.getElementById('userNameBox').href = resL;
                }
              });
            $.ajax({url: 'https://api.spotify.com/v1/me/player/currently-playing' +
            '?market=GB',
              headers: { 'Authorization' : 'Bearer ' + access_token},
                  success: function(response) {
                    var res = JSON.stringify(response.item.name , null, 2);
                   var resL = JSON.stringify(response.item.external_urls.spotify , null, 2);
                   var resA = JSON.stringify(response.item.artists["0"].name);
                var sLength = JSON.stringify(response.item.duration_ms);
                   var sPos = JSON.stringify(response.progress_ms);
                    var reg = /"(.*?)"/;
                        res = reg.exec(res);
                       resL = reg.exec(resL);
                       resA = reg.exec(resA);
                        res = res[1];
                        resL = resL[1];
                        resA = resA[1];
                    document.getElementById('currentPlayingTrack').innerHTML = resA + ' - ' + res;
                    document.getElementById('currentPlayingTrackX').value = resA;
                    document.getElementById('currentPlayingTrackY').value = res;
                    document.getElementById('currentPlayingTrack').href = resL;
                    document.getElementById('sliderSong').max = sLength;
                    document.getElementById('sliderSong').value = sPos;
                  }
                });
              $.ajax({url: 'https://api.spotify.com/v1/me/top/artists'
                +'?time_range='+ timeRangeA + '&limit=5&offset=0',
                headers: { 'Authorization' : 'Bearer ' + access_token},
                    success: function(response) {
                    for (var i=0; i<response.items.length;i++){
                      var res = JSON.stringify(response.items[i].name , null, 2);
                     var resL = JSON.stringify(response.items[i].external_urls.spotify , null, 2);
                      var reg = /"(.*?)"/;
                          res = reg.exec(res);
                         resL = reg.exec(resL);
                          res = res[1];
                          resL = resL[1];
                      document.getElementById('artist'+[i]).innerHTML = res;
                      document.getElementById('artist'+[i]).href = resL;
                    }}
                  });
                $.ajax({url: 'https://api.spotify.com/v1/me/top/tracks'
                +'?time_range=' + timeRangeS + '&limit=5&offset=0',
                  headers: { 'Authorization' : 'Bearer ' + access_token},
                      success: function(response) {
                      for (var i=0; i<response.items.length;i++){
                        var res = JSON.stringify(response.items[i].name , null, 2);
                       var resA = JSON.stringify(response.items[i].artists['0'].name)
                       var resL = JSON.stringify(response.items[i].external_urls.spotify , null, 2);
                        var reg = /"(.*?)"/;
                            res = reg.exec(res);
                           resA = reg.exec(resA);
                           resL = reg.exec(resL);
                            res = res[1];
                           resA = resA[1];
                           resL = resL[1];
                        document.getElementById('song'+[i]).innerHTML = resA  + ' - ' + res;
                        document.getElementById('song'+[i]).href = resL;
                      }}
                    });
        }
      }
})();}
