const { expect } = require('chai');
const request = require('supertest');
const { Genre } = require('../src/models');
const app = require('../src/app');
const faker = require('faker');
const { response } = require('../src/app');

describe('/genres', () => {
  before(async () => await Genre.sequelize.sync());

  describe('with no data in the database', () => {

    describe('POST /genres', () => {

      let testGenre;

      beforeEach(async () => {
        await Genre.destroy({ where: {} });
        testGenre = {
          name: 'Fiction'
        };
      });

      it('creates a new genre', async () => {
        const res = await request(app)
          .post('/genres')
          .send(testGenre);

        const newGenre = await Genre.findByPk(res.body.id, { raw: true });

        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal('Fiction');
      });

      it('returns a 400 plus error message when name not provided', async () => {
        testGenre.name = null;
        const errorMessages = ['Genre.name cannot be null'];
        const res = await request(app)
          .post('/genres')
          .send(testGenre);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when name is a blank string', async () => {
        testGenre.name = '';
        const errorMessages = ['Validation notEmpty on name failed'];
        const res = await request(app)
          .post('/genres')
          .send(testGenre);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

    })

  });

  describe('with the database populated', () => {

    beforeEach(async () => {
      await Genre.destroy({ where: {} });

      genres = await Promise.all([
        Genre.create({ name: faker.name.findName() }),
        Genre.create({ name: faker.name.findName() }),
        Genre.create({ name: faker.name.findName() }),
      ]);
    });

    describe('GET /genres', () => {

      it('gets all genre records', async () => {
        const res = await request(app).get('/genres');
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((genre) => {
          const expected = genres.find((a) => a.id === genre.id);
          expect(genre.name).to.equal(expected.name);
        });
      });

    });

    describe('GET genres/:genreId', () => {

      it('gets an genre by id', async () => {
        const res = await request(app).get(`/genres/${genres[0].id}`);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(genres[0].name);
      });

      it('returns a 404 if genre id does not exist', async () => {
        const res = await request(app).get('/genres/54321');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The genre could not be found.');
      });

    });

    describe('PATCH /genres/:genreId', () => {

      it('updates genre name by id', async () => {
        const newGenre = faker.name.findName();
        while (newGenre === genres[0].name) {
          newGenre = faker.name.findName();
        }
        const res = await request(app)
          .patch(`/genres/${genres[0].id}`)
          .send({
            name: newGenre
          });
        
        const updatedGenre = await Genre.findByPk(genres[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedGenre.name).to.equal(newGenre);
      });

      it('returns a 404 if the genre does not exist', async () => {
        const res = await request(app)
          .patch('/genres/65432')
          .send({ name: "New Genre" });

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The genre could not be found.');
      });

    })

    describe('DELETE /genres/:genreId', () => {

      it('deletes genre by id', async () => {
        const deletedGenre = genres[2];
        const res = await request(app)
          .delete(`/genres/${deletedGenre.id}`);

        expect(res.status).to.equal(204);
        const oldGenre = await Genre.findByPk(deletedGenre.id, { raw: true });
        expect(oldGenre).to.equal(null);
      });

      it('returns a 404 if the genre could not be found', async () => {
        const res = await request(app)
          .delete('/genres/65432');
        
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The genre could not be found.');
      });

    });

  });

});