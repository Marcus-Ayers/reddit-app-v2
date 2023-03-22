json.post do
  json.id @post.id
  json.title @post.title
  json.body @post.body
  json.user_id @post.user_id
  json.subreddit_id @post.subreddit_id
  json.created_at @post.created_at
  json.updated_at @post.updated_at
  json.image url_for(@post.image) if
  @post.image.attached?

  # json.comments @post.comments

  json.user do
    json.id @post.user.id
    json.username @post.user.username
  end
end
