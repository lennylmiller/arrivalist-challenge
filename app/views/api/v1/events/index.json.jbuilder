json.array! @Events do |event|
  json.trip_date event.trip_date
  json.home_state event.home_state
  json.trip_count event.trip_count
end