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
       
          $.ajax({
            url: '/songs/' + data.id + '.json',
            success: function(json) {
                _.each(json, function(track) {
                            
                    if (track.deezer == null) {
                        track.deezer = {
                            link: "deezer track not found",
                            preview: "deezer track not found"
                              } // close attributes
                        }; // close if
                    console.log(track);
                    parsedTemplate += songTemplate(track); 


                }); // close _.each
  
                        $('#similar_songs_collection').html(parsedTemplate);
                        parsedTemplate = "";

                        $('.deezer_send').on('click', function(ev){
                              
                            var deezer_id = $(ev.currentTarget).data('deezer-id');
                            $.ajax({
                                url: '/deezer/post_to_deezer.json',
                                method: 'POST',
                                data: {'deezer_id':deezer_id}
                                
                                

                            }); //close AJAX3    

                        });// close button event

                    } // close success2
          }); // close AJAX2
        } // close success1
      }); //close AJAX1

  }); // close submit function

  
  

}); //close doc ready