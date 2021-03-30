const { expect } = require('chai');
const request = require('supertest');
const { Author } = require('../src/models');
const app = require('../src/app');
const faker = require('faker');
const helpers = require('./helpers');

describe('/authors', () => {
  before(async () => await Author.sequelize.sync());

  describe('with no data in the database', () => {

    describe('POST /authors', () => {

      let testAuthor;

      beforeEach(async () => {
        await Author.destroy({ where: {} });
        testAuthor = {
          name: 'Markus Zusak'
        };
      });

      it('creates a new author', async () => {
        const res = await request(app)
          .post('/authors')
          .send(testAuthor);

        const newAuthor = await Author.findByPk(res.body.id, { raw: true });

        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal('Markus Zusak');
        expect(newAuthor.name).to.equal('Markus Zusak');
      });

      it('returns a 400 plus error message when name not provided', async () => {
        testAuthor.name = null;
        const errorMessages = ['Author.name cannot be null'];
        const res = await request(app)
          .post('/authors')
          .send(testAuthor);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when name is a blank string', async () => {
        testAuthor.name = '';
        const errorMessages = ['Validation notEmpty on name failed'];
        const res = await request(app)
          .post('/authors')
          .send(testAuthor);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

    })

  });

  describe('with the database populated', () => {

    beforeEach(async () => {
      await Author.destroy({ where: {} });

      authors = await Promise.all(helpers.testData('author'));

      // authors = await Promise.all([
      //   Author.create({ name: faker.name.findName() }),
      //   Author.create({ name: faker.name.findName() }),
      //   Author.create({ name: faker.name.findName() }),
      // ]);
    });

    describe('GET /authors', () => {

      it('gets all author records', async () => {
        const res = await request(app).get('/authors');
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((author) => {
          const expected = authors.find((a) => a.id === author.id);
          expect(author.name).to.equal(expected.name);
        });
      });

    });

    describe('GET authors/:authorId', () => {

      it('gets an author by id', async () => {
        const res = await request(app).get(`/authors/${authors[0].id}`);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(authors[0].name);
      });

      it('returns a 404 if author id does not exist', async () => {
        const res = await request(app).get('/authors/54321');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The author could not be found.');
      });

    });

    describe('PATCH /authors/:authorId', () => {

      it('updates author name by id', async () => {
        const newName = faker.name.findName();
        while (newName === authors[0].name) {
          newName = faker.name.findName();
        }
        const res = await request(app)
          .patch(`/authors/${authors[0].id}`)
          .send({
            name: newName
          });
        
        const updatedAuthor = await Author.findByPk(authors[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedAuthor.name).to.equal(newName);
      });

      it('returns a 404 if the author does not exist', async () => {
        const res = await request(app)
          .patch('/authors/65432')
          .send({ name: "New Name" });

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The author could not be found.');
      });

    })

    describe('DELETE /authors/:authorId', () => {

      it('deletes author by id', async () => {
        const deletedAuthor = authors[2];
        const res = await request(app)
          .delete(`/authors/${deletedAuthor.id}`);

        expect(res.status).to.equal(204);
        const oldAuthor = await Author.findByPk(deletedAuthor.id, { raw: true });
        expect(oldAuthor).to.equal(null);
      });

      it('returns a 404 if the author could not be found', async () => {
        const res = await request(app)
          .delete('/authors/65432');
        
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The author could not be found.');
      });

    });

  });

});