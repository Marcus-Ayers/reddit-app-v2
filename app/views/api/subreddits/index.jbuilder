json.subreddits do
  json.array! @subreddits do |subreddit|
    json.id subreddit.id
    json.name subreddit.name
    json.description subreddit.description
    json.posts subreddit.posts

    # json.posts do
    #   json.id subreddit.post.id
    # end
  end
end
