Rails.application.routes.draw do
  post '/register', to: 'users#create'
  post '/login', to: 'users#login'
  post '/logout', to: 'users#logout'
  get 'users/:id', to: 'users#show'
  get 'users', to: 'users#index'
  
  post '/images', to: 'images#create'
  delete '/images/:id', to: 'images#destroy'
  post '/images/:id/share', to: 'images#share'

end
