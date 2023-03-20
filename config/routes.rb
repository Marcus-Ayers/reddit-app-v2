Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/subreddit/:id' => 'static_pages#subreddit'
  get 'subreddit/:sub_id/post/:post_id' => 'static_pages#post'
  get '/user/:user_id' => 'static_pages#user'
  get '/login' => 'static_pages#login'
  delete '/sessions' => 'sessions#destroy'
  get '/submit' => 'static_pages#submit'

  
  namespace :api do
    delete '/subreddits/:sub_id/posts/:post_id' => 'posts#destroy'
    resources :users, except: [:destroy] do
      resources :subscriptions, only: [:index]
    end
    resources :subreddits, except: [:destroy] do
      resources :posts, only: [:index, :show, :create, :destroy] do
        resources :comments, only: [:create, :update, :destroy, :index, :show]
      end
    end
    resources :votes, only: [:create, :update, :destroy]
    resource :sessions, only: [:create, :destroy]
    
    get 'home/index'
    get 'posts/all', to: 'posts#all'
    get '/authenticated' => 'sessions#authenticated'
  end
end
