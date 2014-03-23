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

      ev.preventDefault();
      $('#similar_songs_collection').html('');
      var artist_name = $('#song_artist_name').val();
      var song_name = $('#song_song_name').val();
      var deezer_url = $('#song_deezer_url').val();

      $('#similar_songs_collection').html('<div id="load_container"><div id="load_gif"></div></div>').focus();

      $.ajax({
        url: '/songs.json',
        method: 'POST',
        data: {'song[artist_name]':artist_name, 'song[song_name]':song_name, 'song[deezer_url]':deezer_url},
        success: function(data) {
       
          $.ajax({
            url: '/songs/' + data.id + '.json',
            success: function(json) {
                _.each(json, function(track) {
                            
                    if (track.deezer != null) 
                      {
                        parsedTemplate += songTemplate(track);
                      }  // close if
                    else 
                        {
                          track.deezer = {
                          link: "deezer track not found",
                          preview: "deezer track not found"
                              }; // close attributes.
                          }   // close else.     
                         
                    
                     


                }); // close _.each
  
                        $('#similar_songs_collection').html('<h1>Side B</h1>' + parsedTemplate);
                        parsedTemplate = "";

                        $('.similar_song').mouseenter(function(){
                          $(this).find('.song_dropdown').slideDown();
                        });

                        $('.similar_song').mouseleave(function(){
                          $(this).find('.song_dropdown').slideUp();
                        });

                        $('.song_remove').on('click', function(ev){ 
                            $(ev.currentTarget).parents('.similar_song').hide();
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
                                  var n = noty({
                                    text: json.responseJSON.error.message,
                                    type: 'error',
                                    timeout: 2000
                                  });
                                  
                                }

                            }); //close AJAX3    

                        });// close button event

                    } // close success2
          }); // close AJAX2
        } // close success1
      }); //close AJAX1

  }); // close submit function

  
  

}); //close doc ready