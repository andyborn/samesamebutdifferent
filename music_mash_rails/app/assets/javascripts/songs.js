$(document).ready(function() {

  //////// on page load

  var parsedTemplate = "";
  var parsedTemplate2 = "";
  var tmpl_similar_song = $('#tmpl_similar_song').html();
  var tmpl_fav_song = $('#tmpl_fav_song').html();

  var songTemplate = _.template(tmpl_similar_song);
  var songTemplate2 = _.template(tmpl_fav_song);

  mouseActions();

  /////////////////////

  function sideA(){
      $.ajax({
            url: '/deezer/get_deezer_fav_tracks.json',
            method: 'GET',
            success: function(json){
              console.log(json);
              _.each(json['data'], function(track){
                  if (track.song_info.album.cover == null){
                          var defaultCover = "http://www.rocksound.tv/images/uploads/deezer300.jpg"
                          track.song_info.album.cover = {}
                          track.song_info.album.cover = [{"#text":defaultCover,"size":"small"},{"#text":defaultCover,"size":"medium"},{"#text":defaultCover,"size":"large"},{"#text":defaultCover,"size":"extralarge"}];
                    } //close image if.
                    console.log(track);

                  parsedTemplate2 += songTemplate2(track);

              }) // close each
             $('#similar_songs_collection').html('<h1>Side A</h1>' + parsedTemplate2);
             parsedTemplate2 = '';
             mouseActions(); 
            } // close success
          }); // close side A ajax
  };

////////////////////

  $('#new_song').on('submit', function(ev){
    getSongs(ev);
  });

     
  function getSongs(ev, url) {  
      
      ev.preventDefault();
      // $('#similar_songs_collection').html('');
      var artist_name = $('#song_artist_name').val();
      var song_name = $('#song_song_name').val();
      var deezer_url = url;

      $('#cog1').addClass('rotating1');
      $('#cog2').addClass('rotating2');

      $.ajax({
        url: '/songs.json',
        method: 'POST',
        data: {'song[artist_name]':artist_name, 'song[song_name]':song_name, 'song[deezer_url]':deezer_url},
        error: function(json) {
              $('#cog1').removeClass('rotating1');
              $('#cog2').removeClass('rotating2');
              $('#similar_songs_collection').html('<h2>Sorry, song not found</h2>').focus();
            },
        success: function(data) {
       
          $.ajax({
            url: '/songs/' + data.id + '.json',
            error: function(json) {
                  $('#cog1').removeClass('rotating1');
                  $('#cog2').removeClass('rotating2');
                  $('#similar_songs_collection').html('<h2>Sorry, no Last.fm similar song data found for this song.</h2>').focus();
                },

            success: function(json) {
                $('#cog1').removeClass('rotating1');
                $('#cog2').removeClass('rotating2');
                
                _.each(json, function(track) {                    
                    if (track.image == null){
                            var defaultCover = "http://www.rocksound.tv/images/uploads/deezer300.jpg"
                            track.image = {}
                            track.image = track.image = [{"#text":defaultCover,"size":"small"},{"#text":defaultCover,"size":"medium"},{"#text":defaultCover,"size":"large"},{"#text":defaultCover,"size":"extralarge"}];
                      }

                    if (track.deezer != null) {
                          parsedTemplate += songTemplate(track);
                      } else {
                          track.deezer = {
                          link: "deezer track not found",
                          preview: "deezer track not found"
                          }; // close attributes.
                      }   // close if.    
                }); // close _.each
                
                
                    
                    if (parsedTemplate != "") {
                        $('#similar_songs_collection').fadeOut(function(){
                          $('#similar_songs_collection').html('<h1>Side B</h1>' + parsedTemplate);
                          parsedTemplate = "";
                          $('#similar_songs_collection').fadeIn();
                          
                          mouseActions();
                      
                          
                        });//close fadeOut callback
          
                      } else { 
                          $('#similar_songs_collection').fadeOut(function(){ 
                          $('#similar_songs_collection').html('<h2>Sorry, no Deezer data returned for this song.</h2><h2>Try checking that artist name is spelt correctly (eg. The Rolling Stones, not Rolling Stones!) </h2>');
                          $('#similar_songs_collection').fadeIn();
                        }); // close fadeOut callback
                      } // close if data empty loop
                    } // close success2
          }); // close AJAX2
        } // close success1
      }); //close AJAX1

  }; // close submit function

    function mouseActions() {
    $('.similar_song').mouseenter(function(){
      $(this).find('.play_icon').show(100);
      $(this).find('.song_dropdown').show(100);
    });

    $('.similar_song').mouseleave(function(){
      $(this).find('.play_icon').hide(100);
      $(this).find('.song_dropdown').hide(100);
    });

    $('.play_icon').click(function(){
      var that = $(this).parent('.similar_song').find('.song_player').get(0);
      if (that.paused == false) {
            that.pause();
            $('#cog1').removeClass('rotating3');
            $('#cog2').removeClass('rotating4');
        } else {
            that.play();
            $('#cog1').addClass('rotating3');
            $('#cog2').addClass('rotating4');
        }

     $('audio').bind('ended', function(){
        $('#cog1').removeClass('rotating3');
        $('#cog2').removeClass('rotating4');
     })   
    // document.querySelector("audio").addEventListener("ended", alert('hey'),false);
    });



      // $(this).parent('.similar_song').find('.song_player').trigger("play");
      

    $('.song_info').click(function(){
      $(this).parent('.similar_song').find('.song_dropdown').slideToggle();
    });

    $('.song_info').click(function(){
      $(this).parent('.similar_song').find('.song_dropdown').slideToggle();
    });

    $('.song_remove').on('click', function(ev){ 
        $(ev.currentTarget).parents('.similar_song').remove();
    });

    $('.deezer_more').on('click', function(ev){ 
        var deezer_url = $(ev.currentTarget).data('deezer-url');
        var song_name = $(ev.currentTarget).data('song-name');
        var artist_name = $(ev.currentTarget).data('artist-name');

        $('#song_artist_name').val(artist_name);
        $('#song_song_name').val(song_name);
        getSongs(ev, deezer_url);
    });

    $('#side_A_button').on('click', function(){
      sideA();
    });

    $('.deezer_send').on('click', function(ev){
          
        var deezer_id = $(ev.currentTarget).data('deezer-id');
        $.ajax({
            url: '/deezer/post_to_deezer.json',
            method: 'POST',
            data: {'deezer_id':deezer_id},
            success: function(json) {
                $(ev.currentTarget).hide();
                
                var songAdded = noty({
                  text: 'Song added to your Deezer profile!',
                  timeout: 2000,
                  type: 'success'
                });
              },
            error: function(json) {
                // "Track already exists"
                if (json.responseJSON.error.message == "Track already exists")
                    { var n = noty({
                      text: 'You have already added this track to you deezer profile',
                      type: 'error',
                      timeout: 2000}); // close noty
                      $(ev.currentTarget).hide();
                    }

                else {  
                var n = noty({
                    text: 'Deezer session token has expired, please log in again to refresh',
                    type: 'error',
                    timeout: 2000
                    }); // close noty
                }
            }

        }); //close AJAX3    
      
    });// close button event
  }; 
  

}); //close doc ready