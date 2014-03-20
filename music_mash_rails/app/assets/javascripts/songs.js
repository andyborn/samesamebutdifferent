$(document).ready(function() {

  $('#new_song').on('submit', function(ev){
      ev.preventDefault();

      var artist_name = $('#song_artist_name').val();
      var song_name = $('#song_song_name').val();
      var deezer_url = $('#song_deezer_url').val();

      $.ajax({
        url: '/songs.json',
        method: 'POST',
        data: {'song[artist_name]':artist_name, 'song[song_name]':song_name, 'song[deezer_url]':deezer_url},
        success: function(data) {
          $.ajax({
            url: '/songs/' + data.id
          })
        })



    });


  });