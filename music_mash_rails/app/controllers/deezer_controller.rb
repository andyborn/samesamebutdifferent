class DeezerController < ApplicationController

  def post_to_deezer
    
    if current_user  
      user_id = current_user.deezer_id
      session_token = current_user.token
      deezer_id = params[:deezer_id]
      url= "https://api.deezer.com/user/#{user_id}/tracks?output=jsonp&request_method=POST&track_id=#{deezer_id}&output=jsonp&access_token=#{session_token}"
      
      response = HTTParty.get(url)
      # response = HTTParty.get("https://api.deezer.com/user/448706601/tracks?output=jsonp&request_method=POST&track_id=74415139&output=jsonp&access_token=froSVuFpNj532c693306a26oGnUom4w532c693306a64Wrelkxj")
      binding.pry
      respond_to do |format|
      if response = "(true)"
        
        format.json { render json: {}, status: :success }
      else
        
        format.json { render json: {}, status: :error }
      end
    end
    end

  end 


end