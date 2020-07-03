const express = require("express");
const cors = require("cors");

const { isUuid, uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUuid(req, res, next) {
  const { id } = req.params;

  if(!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();

}

function getRepositoryIndex(req, res, next) {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if( repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.'});
  }
  
  req.repositoryIndex = repositoryIndex;

  return next();

}

app.use("/repositories/:id", validateUuid, getRepositoryIndex);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    ...repositories[request.repositoryIndex],
    title,
    url,
    techs
  };

  repositories[request.repositoryIndex] = repository;

  return response.json(repository)

});

app.delete("/repositories/:id", (req, res) => {

  repositories.splice(req.repositoryIndex, 1);
  
  return res.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  let repository = repositories[request.repositoryIndex];
  repository.likes++;

  repositories[request.repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
