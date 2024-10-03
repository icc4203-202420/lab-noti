Rails.application.routes.draw do
  post '/register', to: 'users#create'
  post '/login', to: 'users#login'
  get 'users/:id', to: 'users#show'
  get 'users', to: 'users#index'
  

  post '/beers', to: 'beers#create'
  delete '/beers/:id', to: 'beers#destroy'
  post '/beers/:id/share', to: 'beers#share'

end
