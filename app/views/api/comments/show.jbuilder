json.comment do
  json.id @comment.id
  json.user @comment.user
  json.body @comment.body
  json.comments @comment.comments
  json.created_at @comment.created_at
end
