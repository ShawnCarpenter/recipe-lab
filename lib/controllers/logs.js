const { Router } = require('express');
const Log = require('../models/log');

module.exports = Router()
  .post('/', (req, res) => {
    Log
      .insert(req.body)
      .then(log => res.send(log));
  })
  
  .get('/', (req, res) => {
    Log
      .find()
      .then(logs => res.send(logs));
  })
  
  .get('/:id', (req, res) => {
    Log
      .findById(req.params.id)
      .then(log => res.send(log));
  })
  
  .put('/:id', (req, res) => {
    Log
      .update(req.params.id, req.body)
      .then(log => res.send(log));
  })
  
  .delete('/:id', (req, res) => {
    Log
      .delete(req.params.id)
      .then(log => res.send(log));
  });
  
