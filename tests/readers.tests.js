const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');
const faker = require('faker');
const { response } = require('../src/app');

describe('/readers', () => {
  before(async () => await Reader.sequelize.sync());

  describe('with no data in the database', () => {
    describe('POST /readers', () => {

      it('creates a new reader', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: 'Markus Zusak',
            email: 'zusak@gmail.com',
            password: 'passsword'
          });

        const newReader = await Reader.findByPk(res.body.id, { raw: true });

        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal('Markus Zusak');
        expect(newReader.name).to.equal('Markus Zusak');
        expect(newReader.email).to.equal('zusak@gmail.com');
        expect(newReader.password).to.equal('passsword');
      });

      it('returns a 400 plus error message when name not provided', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            email: 'zusak@gmail.com',
            password: 'passsword'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('notNull Violation: Reader.name cannot be null');
      });

      it('returns a 400 plus error message when email not provided', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: 'Markus Zusak',
            password: 'passsword'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('notNull Violation: Reader.email cannot be null');
      });

      it('returns a 400 plus error message when password not provided', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: 'Markus Zusak',
            email: 'zusak@gmail.com'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('notNull Violation: Reader.password cannot be null');
      });

      it('returns a 400 plus error message when name is a blank string', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: '',
            email: 'zusak@gmail.com',
            password: 'passsword'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Validation error: Validation notEmpty on name failed');
      });

      it('returns a 400 plus error message when email is invalid', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: 'Markus Zusak',
            email: 'anInvalidEmail',
            password: 'passsword'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Validation error: Validation isEmail on email failed');
      });

      it('returns a 400 plus error message when password less than 9 chars', async () => {
        const res = await request(app)
          .post('/readers')
          .send({
            name: 'Markus Zusak',
            email: 'zusak@gmail.com',
            password: 'pw'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Validation error: Validation len on password failed');
      });
    });
  });

  describe('with the database populated', () => {

    beforeEach(async () => {
      await Reader.destroy({ where: {} });

      readers = await Promise.all([
        Reader.create({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }),
        Reader.create({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }),
        Reader.create({ name: faker.name.findName(), email: faker.internet.email(), password: faker.internet.password() }),
      ]);
    });

    describe('GET /readers', () => {

      it('gets all reader records', async () => {
        const res = await request(app).get('/readers');
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);
          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
          expect(reader.password).to.equal(expected.password);
        });
      });

    });

    describe('GET /readers/:readerId', () => {

      it('gets a reader by id', async () => {
        const res = await request(app).get(`/readers/${readers[0].id}`);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(readers[0].name);
        expect(res.body.email).to.equal(readers[0].email);
        expect(res.body.password).to.equal(readers[0].password);
      });

      it('returns a 404 if reader id does not exist', async () => {
        const res = await request(app).get('/readers/54321');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The reader could not be found.');
      });

    });

    describe('PATCH /readers/:readerId', () => {

      it('updates reader name by id', async () => {
        const newName = faker.name.findName();
        while (newName === readers[0].name) {
          newName = faker.name.findName();
        }
        const res = await request(app)
          .patch(`/readers/${readers[0].id}`)
          .send({
            name: newName
          });
        
        const updatedReader = await Reader.findByPk(readers[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedReader.name).to.equal(newName);
        expect(updatedReader.email).to.equal(readers[0].email);
        expect(updatedReader.password).to.equal(readers[0].password);

      });

      it('updates reader email by id', async () => {
        const newEmail = faker.internet.email();
        while (newEmail === readers[0].email) {
          newEmail = faker.internet.email();
        }
        const res = await request(app)
          .patch(`/readers/${readers[0].id}`)
          .send({
            email: newEmail
          });
        
        const updatedReader = await Reader.findByPk(readers[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedReader.name).to.equal(readers[0].name);
        expect(updatedReader.email).to.equal(newEmail);
        expect(updatedReader.password).to.equal(readers[0].password);
      });

      it('updates reader password by id', async () => {
        const newPassword = faker.internet.password();
        while (newPassword === readers[0].password) {
          newPassword = faker.internet.password();
        }
        const res = await request(app)
          .patch(`/readers/${readers[0].id}`)
          .send({
            password: newPassword
          });
        
        const updatedReader = await Reader.findByPk(readers[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedReader.name).to.equal(readers[0].name);
        expect(updatedReader.email).to.equal(readers[0].email);
        expect(updatedReader.password).to.equal(newPassword);
      });

      it('returns a 404 if the artist does not exist', async () => {
        const res = await request(app)
          .patch('/readers/65432')
          .send({ name: "New Name" });

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The reader could not be found.');
      });

    });

    describe('DELETE /readers/:readerId', () => {

      it('deletes reader by id', async () => {
        const deletedReader = readers[2];
        const res = await request(app)
          .delete(`/readers/${deletedReader.id}`);

        expect(res.status).to.equal(204);
        const oldReader = await Reader.findByPk(deletedReader.id, { raw: true });
        expect(oldReader).to.equal(null);
      });

      it('returns a 404 if the reader could not be found', async () => {
        const res = await request(app)
          .delete('/readers/65432');
        
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The reader could not be found.');
      });

    });

  });

});