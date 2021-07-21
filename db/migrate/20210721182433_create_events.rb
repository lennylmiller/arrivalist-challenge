class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.date :trip_date
      t.string :home_state
      t.integer :trip_count

      t.timestamps
    end
  end
end
