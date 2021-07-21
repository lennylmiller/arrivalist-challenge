Event.delete_all

records = JSON.parse(File.read(File.join(Rails.root, 'db',  'data_points.json')))
records["dataPoints"].each do |record|
  puts record
  Event.create(trip_date: record["trip_date"], home_state: record["home_state"], trip_count: record["trip_count"] )
end
