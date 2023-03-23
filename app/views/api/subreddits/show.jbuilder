json.subreddit do
  json.id @subreddit.id
  json.name @subreddit.name
  json.description @subreddit.description
  json.posts @subreddit.posts
  json.user @subreddit.user

  # json.user do
  #   json.id @subreddit.user.id
  #   json.username @subreddit.user.username
  # end
end
