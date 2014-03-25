class DeezerController < ApplicationController

  def post_to_deezer
    
    if current_user  
      user_id = current_user.deezer_id
      session_token = current_user.token
      deezer_id = params[:deezer_id]
      url= "https://api.deezer.com/user/#{user_id}/tracks?output=json&request_method=POST&track_id=#{deezer_id}&output=jsonp&access_token=#{session_token}"
      
      response = HTTParty.get(url)
      # response = HTTParty.get("https://api.deezer.com/user/448706601/tracks?output=jsonp&request_method=POST&track_id=74415139&output=jsonp&access_token=froSVuFpNj532c693306a26oGnUom4w532c693306a64Wrelkxj")
      response = response[1..-2] # get rid of the brackets around the response... it should be JSON, but it's not... quite

      respond_to do |format|
      if response == "true"        
        format.json { render json: {}, status: :created }
      else
        format.json { render json: JSON.parse(response), status: :unprocessable_entity }
      end
    end
    end

  end 

  def get_deezer_fav_tracks

    user_id = current_user.deezer_id
    session_token = current_user.token
    url= "https://api.deezer.com/user/#{user_id}/tracks?output=json&output=json&access_token=#{session_token}"
    deezer_songs_hash = HTTParty.get(url)
    if deezer_songs_hash['error'] == nil
      deezer_songs_hash['data'].each do |favsong|
        get_url = "http://api.deezer.com/track/" + favsong['id'].to_s
        deezer_song_info_json = HTTParty.get(get_url)
        favsong[:song_info] = deezer_song_info_json
      end
    end
    
    respond_to do |format|
      if deezer_songs_hash['error'] == nil        
        format.json { render json: deezer_songs_hash, status: :created }
      else
        format.json { render json: JSON.parse(response), status: :unprocessable_entity }
      end
    end  
  end

  # def post_to_deezer_playlist
    
  #   if current_user  
  #     user_id = current_user.deezer_id
  #     session_token = current_user.token
  #     deezer_id = params[:deezer_id]
  #     playlist_id = current_user.deezer_playlist
      
  #     url= "https://api.deezer.com/user/#{user_id}/tracks?output=json&request_method=POST&track_id=#{deezer_id}&output=jsonp&access_token=#{session_token}"
      
  #     response = HTTParty.get(url)
  #     # response = HTTParty.get("https://api.deezer.com/user/448706601/tracks?output=jsonp&request_method=POST&track_id=74415139&output=jsonp&access_token=froSVuFpNj532c693306a26oGnUom4w532c693306a64Wrelkxj")
  #     response = response[1..-2] # get rid of the brackets around the response... it should be JSON, but it's not... quite

  #     respond_to do |format|
  #     if response == "true"        
  #       format.json { render json: {}, status: :created }
  #     else
  #       format.json { render json: JSON.parse(response), status: :unprocessable_entity }
  #     end
  #   end
  #   end

  # end 


end