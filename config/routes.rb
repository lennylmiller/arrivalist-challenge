Rails.application.routes.draw do
  post 'signin', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'
end
