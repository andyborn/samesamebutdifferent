class OmniauthCallbacksController < Devise::OmniauthCallbacksController
      def deezer
        
        user = User.from_omniauth(request.env["omniauth.auth"])
        token = request.env["omniauth.auth"]['credentials']['token']
        @test = HTTParty.get("https://api.deezer.com/artist/27?output=json&output=json&access_token=#{token}")
        binding.pry
        if user.persisted?
          flash.notice = "Signed in Through Deezer!"
          sign_in_and_redirect user
        else
          session["devise.user_attributes"] = user.attributes
          flash.notice = "Problem creating account"
          redirect_to new_user_registration_url
        end
      end
    end