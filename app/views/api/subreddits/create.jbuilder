json.post do
  json.id @subreddit.id
  json.name @subreddit.title
  json.description @subreddit.body
  json.user_id @subreddit.user_id
  json.created_at @subreddit.created_at
  json.updated_at @subreddit.updated_at

  json.subreddit do
    json.id @subreddit.user.id
    json.username @subreddit.user.username
  end
end
