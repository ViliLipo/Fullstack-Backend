
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

let persons = [
    {
      "name": "Jaromir Jagr",
      "number": "15612611",
      "id": 1
    },
    {
      "name": "Petteri Nummelin",
      "number": "15-66167223",
      "id": 2
    },
    {
      "name": "Olli Jokinen",
      "number": "156161",
      "id": 3
    },
    {
      "name": "Teemu Selänne",
      "number": "8",
      "id": 4
    },
    {
      "name": "Tuomo Ruutu",
      "number": "56617878",
      "id": 5
    },
    {
      "name": "Jere Karalahti",
      "number": "15006715",
      "id": 6
    },
    {
      "name": "Jere Lehtinen",
      "number": "5161356",
      "id": 7
    },
    {
      "name": "Ville Peltonen",
      "number": "516673452",
      "id": 8
    },
    {
      "name": "Matti Nykänen",
      "number": "15616233",
      "id": 9
    }
  ]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  //console.log(person)
  if(person) {
    res.json(person)
  }else {
    res.status(404).json({error: 'no such id'})
  }
})
app.post('/api/persons/', (req, res)=> {
  const body = req.body
  if (body.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  const id = generateId()
  if(persons.find(person => person.name === body.name)) {
    console.log("non-uniquename")
    return res.status(400).json({error: 'name must be unique'})
  }
  if( persons.find(person => person.id === id)) {
    console.log("failed id genaration")
    return res.status(400).json({error:'id generation exception'})
  }
  const person = {
    name: body.name,
    number: body.number,
    id
  }
  persons = persons.concat(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if(person) {
    console.log(person, "poistetaan")
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    console.log("person not found on delete")
    res.status(204).json({error: 'no such id'})
  }
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
