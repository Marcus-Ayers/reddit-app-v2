json.comments do
  json.array! @comments do |comment|
    json.id comment.id
    json.body comment.body
  end
end
