const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan('tiny'));
app.use(morgan(':body'));
const generateId = () => {
  const maxID = persons.length
    ? Math.max(...persons.map((n) => Number(n.id)))
    : 0;

  return String(maxID + 1);
};
app.get('/info', (request, response) => {
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
  );
  console.log(response);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((n) => n.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});
app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({ error: 'Name Missing' });
  } else if (!body.number) {
    return response.status(400).json({ error: 'Number Missing' });
  }

  const checkDuplicateName = persons.find((n) => n.name === body.name);

  if (checkDuplicateName) {
    return response
      .status(400)
      .json({ error: `Name ${body.name} already exists` });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(persons);
});
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => {
    return p.id !== id;
  });

  response.status(204).end();
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
