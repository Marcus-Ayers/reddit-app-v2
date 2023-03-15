class StaticPagesController < ApplicationController
  def home
    render 'home'
  end

  def subreddit
    @data = { subreddit_id: params[:id] }.to_json
    render 'subreddit'
  end

  def post
    @data = { post_id: params[:post_id], subreddit_id: params[:sub_id] }.to_json
    render 'post'
  end

  def user
    @data = { user: params[:user_id] }.to_json
    render 'user'
  end

  def login
    render 'login'
  end
end
