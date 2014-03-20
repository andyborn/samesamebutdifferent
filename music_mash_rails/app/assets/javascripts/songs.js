$(document).ready(function() {

  // var songValues = {},
  // var songInfo = $('#songTemplate').html(),

  var parsedTemplate = "";
  var tmpl_song = $('#tmpl_song').html();

  var songTemplate = _.template(tmpl_song);

  $('#new_song').on('submit', function(ev){

      ev.preventDefault();
      $('#similar_songs_collection').html('');
      var artist_name = $('#song_artist_name').val();
      var song_name = $('#song_song_name').val();
      var deezer_url = $('#song_deezer_url').val();

      $.ajax({
        url: '/songs.json',
        method: 'POST',
        data: {'song[artist_name]':artist_name, 'song[song_name]':song_name, 'song[deezer_url]':deezer_url},
        success: function(data) {
          console.log(data);
          $.ajax({
            url: '/songs/' + data.id + '.json',
            success: function(json) {
                          _.each(json, function(track) {
                            parsedTemplate += songTemplate(track); 


                            }); // close _.each
                                console.log('before');
                            console.log(parsedTemplate);
                            console.log('after');
                            $('#similar_songs_collection').html(parsedTemplate);
                            parsedTemplate = "";

                    } // close success2
          }); // close AJAX2
        } // close success1
      }); //close AJAX1

  }); // close submit function

  

}); //close doc ready