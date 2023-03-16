json.comments do
  json.array! @comments do |comment|
    json.id comment.id
    json.body comment.body
    json.user comment.user
  end
end
