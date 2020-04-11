const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title, 
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) return response.status(400).json({ error: 'ID not found.' });

  repositories[repositoryIndex] = { ...repositories[repositoryIndex], title, url, techs };

  return response.status(200).json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) return response.status(400).json({ error: 'ID not found.' });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex < 0) return response.status(400).json({ error: 'ID not found.' });

  let { likes } = repositories[repositoryIndex];
  let repository = { ...repositories[repositoryIndex], likes: likes+1 };
  
  repositories[repositoryIndex] = repository;
  
  return response.status(200).json(repository);
});

module.exports = app;
