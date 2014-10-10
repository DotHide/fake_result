class AddTitleToResults < ActiveRecord::Migration
  def up
  	add_column :results, :title, :string
  end

  def down
  	remove_column :results, :title
  end
end
