const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id', async() => {
    const recipe = await Recipe.insert({ name: 'cookies', directions: [] });

    return request(app)
      .get(`/api/v1/recipes/${recipe.id}`)
      .then(res => expect(res.body).toEqual(recipe));
  });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });
  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({ name: 'cookies', directions: [] });

    return request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)
      .then(res => expect(res.body).toEqual(recipe));
  });

  it('creates a log', async() => {

    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2020-09-22',
        notes: 'Yummy, would make again',
        rating: 10
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2020-09-22T07:00:00.000Z',
          notes: 'Yummy, would make again',
          rating: 10
        });
      });
  });

  it('gets all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const logs = await Promise.all([
      { recipeId: recipe.id, dateOfEvent: '2020-09-22', notes: 'Yum', rating: 10 },
      { recipeId: recipe.id, dateOfEvent: '2020-09-22', notes: 'Yuck', rating: 1 },
      { recipeId: recipe.id, dateOfEvent: '2020-09-22', notes: 'OK', rating: 5 }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual({ ...log, dateOfEvent: log.dateOfEvent.toISOString() });
        });
      });
  });

  it('gets a log by id', async() => {
    const recipe = await Recipe.insert({ name: 'cookies', directions: [] });
    const log = await Log.insert({ recipeId: recipe.id, dateOfEvent: '2020-09-22', notes: 'Yum', rating: 10 });
    return request(app)
      .get(`/api/v1/logs/${log.id}`)
      .then(res => expect(res.body).toEqual({ ...log, dateOfEvent: log.dateOfEvent.toISOString() }));
  });

  
});
