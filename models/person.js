const mongoose = require('mongoose')

if( process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URL
//'mongodb://admin:memelord@ds119258.mlab.com:19258/persons'

const Schema = mongoose.Schema

mongoose.connect(url)

mongoose.Promise = global.Promise;

var personSchema = new Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)


module.exports = Person
