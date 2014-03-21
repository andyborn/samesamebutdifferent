MusicMashRails::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks'}

  resources :songs

  post 'deezer/post_to_deezer' => 'deezer#post_to_deezer'

  match 'auth/deezer/callback' => 'sessions#create'
  match 'auth/failure' => 'errors#login_failed'

  root to: "songs#index"
end
