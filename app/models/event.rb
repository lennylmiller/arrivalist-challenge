class Event < ApplicationRecord
  def to_builder
    Jbuilder.new do |event|
      event.(self, :id, :trip_date, :home_state, :trip_count)
    end
  end
end
