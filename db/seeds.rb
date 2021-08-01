Event.delete_all

records = JSON.parse(File.read(File.join(Rails.root, 'db',  'data_points.json')))
records["dataPoints"].each do |record|
  puts record
  Event.create(trip_date: record["trip_date"], home_state: record["home_state"], trip_count: record["trip_count"] )
end

Dashboard.create(name: 'Arrivalist Homework', description: 'Getting things setup')


# Remove
Beer.create(brand: 'Double Stout', style: 'Stout', country: 'England', quantity: 54)
Beer.create(brand: 'Spaten', style: 'Helles', country: 'Germany', quantity: 3)
Beer.create(brand: 'Newcastle', style: 'Brown ale', country: 'UK', quantity: 12)
