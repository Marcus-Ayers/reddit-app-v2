json.posts do
  json.array! @posts do |post|
    json.id post.id
    json.title post.title
    json.body post.body
    json.created_at post.created_at
    json.user post.user
    json.comments post.comments
    json.subreddit post.subreddit

    # json.subreddit do
    #   json.id post.subreddit.id
    # end
  end
end
