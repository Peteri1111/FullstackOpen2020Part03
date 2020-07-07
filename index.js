require('dotenv').config()
const express = require('express'),
  app = express(),
  morgan = require('morgan'),
  cors = require('cors'),
  Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (req) => {
  if (req.method === 'POST') return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data')
)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((person) => res.json(person))
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      Person.find({}).length
    } people</p>${new Date()}<p>`
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((res) => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => {
      next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body
  if (
    person.number === undefined ||
    person.number.length <= 0 ||
    person.name === undefined ||
    person.name.length <=
      0 /*||
    persons.filter((p) => p.name === person.name).length !== 0
  */
  ) {
    return res.status(400).json({
      error: 'Some data was missing or the name has been taken.',
    })
  } else {
    const newPerson = new Person({
      name: person.name,
      number: person.number,
    })
    newPerson
      .save()
      .then((savedPerson) => {
        res.json(savedPerson)
      })
      .catch((error) => next(error))
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    console.log('asdasdasdsadasdasd')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    error.name === 'ValidationError' ||
    error.name === 'ReferenceError'
  ) {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
