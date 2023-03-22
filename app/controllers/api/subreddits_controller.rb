module Api
  class SubredditsController < ApplicationController
    def create
      token = cookies.signed[:reddit_session_token]
      session = Session.find_by(token: token)
      if session.nil?
        render json: { error: "You must be logged in to create a subreddit" }, status: :unauthorized
      else
        @subreddit = session.user.subreddits.new(subreddit_params)
        if @subreddit.save
          render json: { subreddit: @subreddit }, status: :created
        else
          render json: { error: @subreddit.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end

    def index
      @subreddits = Subreddit.order(created_at: :desc)
      return render json: { error: 'not_found' }, status: :not_found if !@subreddits

      render 'api/subreddits/index', status: :ok
    end

    def show
      @subreddit = Subreddit.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@subreddit

      render 'api/subreddits/show', status: :ok
    end

    def search
      query = params[:query].downcase
      subreddits = Subreddit.where('lower(name) LIKE ?', "%#{query}%").limit(5)
      render json: { subreddits: subreddits }
    end
    

    private

    def subreddit_params
      params.require(:subreddit).permit(:name, :description)
    end
  end
end
