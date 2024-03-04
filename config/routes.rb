Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/properties/' => 'static_pages#user_properties'
  get 'properties/create' => 'static_pages#create_properties'
  get 'properties/edit/:id' => 'static_pages#edit_properties'
  get 'bookings' => 'static_pages#bookings'
  get '/booking/:id/success' => 'static_pages#booking_success'



  namespace :api do
    # Add routes below this line
    resources :users, only: [:create]
    resources :sessions, only: %i[create destroy]
    resources :properties, only: %i[index show create update destroy]
    resources :bookings, only: [:create]
    resources :charges, only: [:create]

    get '/:username/properties' => 'properties#properties_by_user'

    get '/properties/:id/bookings' => 'bookings#get_property_bookings'

    get '/authenticated' => 'sessions#authenticated'

    post '/properties' => 'properties#create'

    delete 'sessions/destroy' => 'sessions#destroy'

    get '/user_bookings', to: 'bookings#user_bookings'

    get 'is_paid', to: 'bookings#is_paid?'

    get '/bookings/user_owned_property_bookings', to: 'bookings#user_owned_property_bookings'





    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'
  end



end
