
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
var morgan = require('morgan')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', function(req,res) {
   return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.body(req,res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))

const Person = require('./models/person')


app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(Person.format))
  }).catch(error => {
    console.log(error)
    res.status(400).end()
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
        .findById(id)
        .then(person => {
          res.json(Person.format(person))
        }).catch(error => {
          console.log(error)
          res.status(400).end()
        })
})
app.post('/api/persons/', (req, res)=> {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  console.log("lel")
  Person.find({name: body.name}).then(found => {
    console.log(found[0])
    if(found[0] === undefined) {

      const person = new Person ({
        name: body.name,
        number: body.number
      })
      person
            .save()
            .then(savedPerson => {
              res.json(Person.format(savedPerson))
            }).catch(error => {
              console.log(error)
              res.status(400).end()
            })
    } else {
            res.status(400).send({error: 'non unique name'})
    }
  })

})

app.delete('/api/persons/:id', (req, res) => {
  Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
          res.status(204).end()
        })
        .catch(error => {
          res.status(400).send({error:'malformatted id'})
        })
})

app.put('/api/persons/:id', (req,res) => {
  const body = req.body
  const person = {
    name : body.name,
    number : body.number
  }
  Person
        .findByIdAndUpdate(req.body.id, person, {new: true})
        .then(updatedPerson => {
          res.json(Person.format(updatedPerson))
        }).catch(error => {
          //console.log(error)
          res.status(400).send({error: 'malformatted id'})
        })
})

app.get('/info',(req,res) => {
  const amount = persons.length
  const date = new Date()
  res.send(`<p> puhelinluettelossa ${amount} henkilön tiedot</p>
    <p> ${date} </p>`)
})

const generateId = () => {
  return Math.floor(Math.random() * 1000)
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
