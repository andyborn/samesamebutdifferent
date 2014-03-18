class ApplicationController < ActionController::Base
  protect_from_forgery

protected
  def after_sign_in_path_for(resource)
    new_song_path
  end
  
end
