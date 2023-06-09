module Api
  class CommentsController < ApplicationController
    def create
      @post = Post.find_by(id: params[:post_id])
      return render json: { error: 'not_found_post' }, status: :not_found unless @post
  
      token = cookies.signed[:reddit_session_token]
      session = Session.find_by(token: token)
  
      return render json: { error: 'unauthorized' }, status: :unauthorized unless session
  
      user = session.user
      @comment = @post.comments.new(comment_params)
      @comment.user = user # assign the user to the comment
  
      if @comment.save
        # You can redirect or respond with JSON as you prefer
        # For example, if you want to return the created comment as JSON:
        render json: @comment, status: :created
      else
        render json: { error: 'failed_to_create_comment', errors: @comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      token = cookies.signed[:reddit_session_token]
      session = Session.find_by(token: token)
    
      return render json: { success: false } unless session
    
      user = session.user
      comment = Comment.find_by(id: params[:id])
    
      if comment && (comment.user == user) && comment.destroy
        render json: {
          success: true,
        }
      else
        render json: {
          success: false,
        }
      end
    end

    def update
      comment = Comment.find(params[:id])
      token = cookies.signed[:reddit_session_token]
      session = Session.find_by(token: token)
      user = session.user
      # Ensure the current user is the owner of the comment before updating
      if user && user.id == comment.user_id
        if comment.update(comment_params)
          render json: { success: true, comment: comment }, status: :ok
        else
          render json: { success: false, errors: comment.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { success: false, error: "Unauthorized" }, status: :unauthorized
      end
    end

    def index
      @post = Post.find_by(id: params[:post_id])
      return render json: { error: 'not_found_post' }, status: :not_found unless @post
    
      @comments = @post.comments.order(created_at: :desc)
      return render json: { error: 'not_found' }, status: :not_found if !@comments
    
      render 'api/comments/index', status: :ok
    end

    def show
      @comment = Comment.find(params[:id])
      render json: { comment: @comment }
    end
    
    def comment_params
      params.require(:comment).permit(:body)
    end
  end
end
