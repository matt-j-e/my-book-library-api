const { expect } = require('chai');
const request = require('supertest');
const { Reader } = require('../src/models');
const app = require('../src/app');
const faker = require('faker');

describe('/readers', () => {
  before(async () => await Reader.sequelize.sync());

  describe('with no data in the database', () => {
    describe('POST /readers', () => {

      let testReader;

      beforeEach(async () => {
        await Reader.destroy({  where: {} });
        testReader = {
          name: 'Matt Edwards',
          email: 'matt@gmail.com',
          password: 'passsword'
        };
      });

      it('creates a new reader', async () => {
        const res = await request(app)
          .post('/readers')
          .send(testReader);

        const newReader = await Reader.findByPk(res.body.id, { raw: true });

        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal('Matt Edwards');
        expect(newReader.name).to.equal('Matt Edwards');
        expect(newReader.email).to.equal('matt@gmail.com');
        expect(newReader.password).to.equal('passsword');
      });

      it('returns a 400 plus error message when name not provided', async () => {
        testReader.name = null;
        const errorMessages = ['Reader.name cannot be null'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when email not provided', async () => {
        testReader.email = null;
        const errorMessages = ['Reader.email cannot be null'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when password not provided', async () => {
        testReader.password = null;
        const errorMessages = ['Reader.password cannot be null'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when name is a blank string', async () => {
        testReader.name = '';
        const errorMessages = ['Validation notEmpty on name failed'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when email is invalid', async () => {
        testReader.email = 'invalidEmail';
        const errorMessages = ['Validation isEmail on email failed'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
      });

      it('returns a 400 plus error message when password less than 9 chars', async () => {
        testReader.password = 'pw';
        const errorMessages = ['Validation len on password failed'];
        const res = await request(app)
          .post('/readers')
          .send(testReader);
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.eql(errorMessages);
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
          expect(reader.password).to.equal(undefined);
        });
      });

    });

    describe('GET /readers/:readerId', () => {

      it('gets a reader by id', async () => {
        const res = await request(app).get(`/readers/${readers[0].id}`);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(readers[0].name);
        expect(res.body.email).to.equal(readers[0].email);
        expect(res.body.password).to.equal(undefined);
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

      it('returns a 404 if the reader does not exist', async () => {
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