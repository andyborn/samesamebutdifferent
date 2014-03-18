class OmniauthCallbacksController < Devise::OmniauthCallbacksController
      def deezer
        
        user = User.from_omniauth(request.env["omniauth.auth"])
        @test = HTTParty.get("https://api.deezer.com/artist/27?output=json&output=json&access_token=frlB9ckGmV5328711ef2956NwANNV825328711ef2b397eQdpjG=js-v1.0.0&callback=DZ.request.callbacks.dzcb_005328720204acfa1_316655360")
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