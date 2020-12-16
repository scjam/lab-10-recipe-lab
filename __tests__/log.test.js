const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');


describe('log routes', () => {
  let recipe;
  let log;
  
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    recipe = await Recipe.insert({
      name: 'gingerbread cookies',
      directions: []
    });
    log = await Log.insert({
      recipeId: recipe.id,
      dateOfEvent: '2020-12-25',
      notes: 'nice texture',
      rating: 90  
    });
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new log via POST', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: recipe.id,
        dateOfEvent: '2021-01-01',
        notes: 'party',
        rating: 80
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: '2021-01-01',
          notes: 'party',
          rating: 80
        });
      });
  });

  it('gets all logs via GET', async() => {
    const logs = await Promise.all([
      {
        recipeId: recipe.id,
        dateOfEvent: '2020-12-29',
        notes: 'brooke birthday',
        rating: 23
      },
      {
        recipeId: recipe.id,
        dateOfEvent: '2021-02-27',
        notes: 'margot birthday',
        rating: 28
      },
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  
});
