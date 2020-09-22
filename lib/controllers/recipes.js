const { Router } = require('express');
const Recipe = require('../models/recipe');

module.exports = Router()
  .post('/api/v1/recipes', (req, res) => {
    Recipe
      .insert(req.body)
      .then(recipe => res.send(recipe));
  });
