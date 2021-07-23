Rails.application.routes.draw do
  namespace :api do
    scope module: :v1, constraints: ApiVersion.new('v1', true) do
      get 'events', to: 'events#index'
    end

    post 'signin', to: 'authentication#authenticate'
    post 'signup', to: 'users#create'
  end
end
