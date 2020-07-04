const express = require("express"),
  app = express(),
  morgan = require("morgan"),
  cors = require("cors"),
  mongoose = require("mongoose");

const url = `mongodb+srv://fullstack:${password}@cluster0.saygo.mongodb.net/persons-app?retryWrites=true&w=majority
  `;

app.use(express.json());
app.use(cors());
app.use(express.static("build"));
morgan.token("data", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: 1,
    number: "12-43-245325",
    name: "Dan Makarooni",
  },
  {
    id: 2,
    number: "65-43-253425",
    name: "Jorma Vuori",
  },
  {
    id: 3,
    number: "5435",
    name: "The Stone",
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>${new Date()}<p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(204).end();
  }
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
    person.name.length <= 0 ||
    persons.filter((p) => p.name === person.name).length !== 0
  ) {
    return res.status(400).json({
      error: "Some data was missing or the name has been taken.",
    });
  } else {
    person.id = Math.floor(Math.random() * 999999);
    persons = persons.concat(person);
    res.json(person);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
