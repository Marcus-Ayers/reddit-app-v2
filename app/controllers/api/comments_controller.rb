module Api
  class CommentsController < ApplicationController
    def index
      @comments = Comment.order(created_at: :desc)
      return render json: { error: 'not_found' }, status: :not_found if !@comments

      render 'api/comments/index', status: :ok
    end

    def show
      @comment = Comment.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@post

      render 'api/comments/show', status: :ok
    end
  end
end
