class CreateSubreddits < ActiveRecord::Migration[6.1]
  def change
    create_table :subreddits do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :description
      t.timestamps
    end
  end
end
