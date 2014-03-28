class AddColumnsToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :artist_name, :string
    add_column :songs, :song_name, :string
    add_column :songs, :deezer_url, :string
    add_column :songs, :similar_songs, :string
  end
end
