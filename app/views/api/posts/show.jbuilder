json.post do
  json.id @post.id
  json.user @post.user
  json.title @post.title
  json.body @post.body
  json.subreddit @post.subreddit
  json.comments @post.comments
  json.created_at @post.created_at
  json.votes_count @votes_count
end
