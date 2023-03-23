class Subreddit < ApplicationRecord
  belongs_to :user
  has_many :posts, dependent: :destroy
  # has_many :subscriptions, dependent: :destroy
  validates :name, presence: true, uniqueness: true
end
