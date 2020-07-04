require("dotenv").config();
const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  cors = require("cors"),
  Person = require("./models/person");

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("data", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => res.json(person));
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>${new Date()}<p>`
  );
});
/*
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(204).end();
  }
});
*/
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;
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
      error: "Some data was missing or the name has been taken.",
    });
  } else {
    const newPerson = new Person({
      name: person.name,
      number: person.number,
    });
    newPerson.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
