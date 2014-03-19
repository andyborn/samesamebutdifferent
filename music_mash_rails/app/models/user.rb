class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:deezer] 

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  # attr_accessible :title, :body


  def self.from_omniauth(auth)
      if user = User.find_by_email(auth.info.email)
        user.provider = auth.provider
        user.token = auth.credentials.token
        user.uid = auth.uid
        user
      else
        where(auth.slice(:provider, :uid)).first_or_create do |user|
          user.provider = auth.provider
          user.uid = auth.uid
          user.email = auth.info.email
          user.password = Devise.friendly_token[0,20]
          user.token = auth.credentials.token
          user.name = auth.info.name
          user.first_name = auth.info.first_name
          user.last_name = auth.info.last_name
          user.deezer_image = auth.info.deezer_image
          user.deezer_profile = auth.info.urls.Deezer
          user.deezer_id = auth.uid
        end
      end
      # binding.pry
  end

end  