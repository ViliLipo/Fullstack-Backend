
const mongoose = require('mongoose')

const url = 'mongodb://admin:memelord@ds119258.mlab.com:19258/persons'

mongoose.connect(url)

mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

let name = process.argv[2]
let number = process.argv[3]
if(name && number) {
  console.log('lisätään henkilö ',name, ' numero ' , number, 'luetteloon')
  person = new Person( {
    name: name,
    number: number
    })
  person
      .save()
      .then(response =>  {
        console.log('note saved!')
        mongoose.connection.close()
      })
} else {
  console.log('Puhelinluettelo: ')
  Person.find({})
        .then(result => {
          //console.log(result)
          result.forEach(person => {
            console.log(person.name, ' ', person.number)
          })
          mongoose.connection.close()
        })

}
