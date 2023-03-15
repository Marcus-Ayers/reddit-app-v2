class CreatePosts < ActiveRecord::Migration[6.1]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.text :body
      t.references :subreddit, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.integer :votes_count, default: 0

      t.timestamps
    end
  end
end
