/* Retrive correct host's url */
const URL = () => {
  var protocol = window.location.protocol;
  var hostname = window.location.hostname;
  var port     = window.location.port;
  return protocol+'//'+hostname+':'+port;
}

/* Get YT's playlists JSON */
function youtubePlaylists(){
  var ytPlaylistsUrl = URL() + '/youtubePlaylists';
  $.getJSON(ytPlaylistsUrl)
    .done((data) => {
      $('.placeholder').remove();

      /* Append a small message */
      $('#youtube-lists').append("<small> Scegli da dove esportare (Non scegliere nulla per creare una nuova playlist)</small>");

      /* We process each item of data */
      data.items.forEach((data) => {
        $('.youtube-lists')
          .append("<div class='form-check'><label class='form-check-label'><input type='radio' name='existyt' class='form-check-input' value='"+data.id+"'>"+data.title+"<small><i> ID:"+data.id+"</i></small></label></div>");
      });
      
    })
    .fail((err) => {
      console.log('Errore: ' + JSON.stringify(err));
    });
}