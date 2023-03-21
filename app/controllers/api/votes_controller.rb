module Api
  class VotesController < ApplicationController
    protect_from_forgery with: :null_session

    before_action :find_post

    def upvote
      @post.upvote
      render json: { votes_count: @post.votes_count }
    end

    def downvote
      @post.downvote
      render json: { votes_count: @post.votes_count }
    end

    private

    def find_post
      @post = Post.find(params[:id])
    end
  end
end
