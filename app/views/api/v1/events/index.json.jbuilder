# json.array! @events, :id, :trip_date, :home_state, :trip_count
json.array! @events do |event|
  json.id event.id
  json.trip_date event.trip_date
  json.home_state event.home_state
  json.trip_count event.trip_count
end