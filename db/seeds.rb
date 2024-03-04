# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
users = User.create([
  { username: 'Tommy', email: 'tommy@test.com', password: 'password' },
  { username: 'Bobby', email: 'bobby@test.com', password: 'password' },
  { username: 'Sarah', email: 'sarah@test.com', password: 'password' },
  { username: 'Lilly', email: 'lilly@test.com', password: 'password' },
  { username: 'Jimmy', email: 'jimmy@test.com', password: 'password' },
  { username: 'Cammy', email: 'cammy@test.com', password: 'password' },
])
