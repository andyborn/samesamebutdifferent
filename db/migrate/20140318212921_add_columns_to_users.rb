class AddColumnsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :deezer_id, :string
    add_column :users, :deezer_image, :string
    add_column :users, :token, :string
    add_column :users, :deezer_profile, :string
    add_column :users, :deezer_playlist, :string
  end
end
