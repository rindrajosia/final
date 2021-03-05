class CreateFavorites < ActiveRecord::Migration[6.1]
  def change
    create_table :favorites do |t|
      t.string :name
      t.bigint :priority
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end