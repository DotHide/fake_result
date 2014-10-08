class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.string :name
      t.integer :count

      t.timestamps
    end
  end
end
