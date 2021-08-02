Rails.application.routes.draw do
  root 'dashboards#index'

  namespace :api do
    namespace :v1 do
      get 'events', to: 'events#index'
    end

    post 'signin', to: 'authentication#authenticate'
    post 'signup', to: 'users#create'
  end
end
