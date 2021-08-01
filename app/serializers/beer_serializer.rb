class BeerSerializer < ActiveModel::Serializer
  attributes :id, :brand, :style, :country, :quantity
end
