const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');


describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new log via POST', () => {
    return request(app)
      .post('/api/v1/logs')
      .send({
        dateOfEvent: '2021-01-01',
        notes: 'good',
        rating: 80
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          dateOfEvent: '2021-01-01',
          notes: 'good',
          rating: '80'
        });
      });
  });

  
});
