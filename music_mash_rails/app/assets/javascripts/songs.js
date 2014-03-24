$(document).ready(function() {

  // $.noty.defaults = {
  //   layout: 'top',
  //   theme: 'defaultTheme',
  //   type: 'alert',
  //   text: '', // can be html or string
  //   dismissQueue: true, // If you want to use queue feature set this true
  //   template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
  //   animation: {
  //       open: {height: 'toggle'},
  //       close: {height: 'toggle'},
  //       easing: 'swing',
  //       speed: 500 // opening & closing animation speed
  //   },
  //   timeout: 200, // delay for closing event. Set false for sticky notifications
  //   force: false, // adds notification to the beginning of queue when set to true
  //   modal: false,
  //   maxVisible: 5, // you can set max visible notification for dismissQueue true option,
  //   killer: false, // for close all notifications before show
  //   closeWith: ['click'], // ['click', 'button', 'hover']
  //   callback: {
  //       onShow: function() {},
  //       afterShow: function() {},
  //       onClose: function() {},
  //       afterClose: function() {}
  //   },
  //   buttons: false // an array of buttons
  // };

  // var songValues = {},
  // var songInfo = $('#songTemplate').html(),

  var parsedTemplate = "";
  var tmpl_song = $('#tmpl_song').html();

  var songTemplate = _.template(tmpl_song);

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
                                  
                              } else {
                                  that.play();
                                  
                              }
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

  
  

}); //close doc ready