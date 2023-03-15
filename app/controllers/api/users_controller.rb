module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def index
      @users = User.order(created_at: :desc)
      return render json: { error: 'not_found' }, status: :not_found if !@users

      render 'api/users/index', status: :ok
    end

    def show
      @user = User.find_by(id: params[:id])
      @posts = Post.where(user_id: @user.id)
      return render json: { error: 'not_found' }, status: :not_found if !@user

      render 'api/users/show', status: :ok
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
