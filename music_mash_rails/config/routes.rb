MusicMashRails::Application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks'}

  resources :songs

  match 'auth/deezer/callback' => 'sessions#create'
  match 'auth/failure' => 'errors#login_failed'

  root to: "songs#index"
end
