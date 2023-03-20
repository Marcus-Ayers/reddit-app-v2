class Post < ApplicationRecord
  belongs_to :subreddit
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_one_attached :image
  # has_many :votes, dependent: :destroy

  validates :title, presence: true
  # validates :subreddit, presence: true
  validates :user, presence: true

  def upvote
    self.votes_count += 1
    save
  end

  def downvote
    self.votes_count -= 1
    save
  end
end
