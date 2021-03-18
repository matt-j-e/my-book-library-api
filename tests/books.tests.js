const { expect } = require('chai');
const request = require('supertest');
const { Reader, Book } = require('../src/models');
const app = require('../src/app');
const faker = require('faker');
const { response } = require('../src/app');

describe('/books', () => {
  before(async () => await Book.sequelize.sync());

  describe('with no data in the database', () => {
    describe('POST /books', () => {

      it('creates a new book', async () => {
        const res = await request(app)
          .post('/books')
          .send({
            title: 'The Book Thief',
            author: 'Markus Zusak',
            genre: 'fiction',
            ISBN: '23456X'
          });

        const newBook = await Book.findByPk(res.body.id, { raw: true });

        expect(res.status).to.equal(201);
        expect(res.body.title).to.equal('The Book Thief');
        expect(newBook.title).to.equal('The Book Thief');
        expect(newBook.author).to.equal('Markus Zusak');
        expect(newBook.genre).to.equal('fiction');
        expect(newBook.ISBN).to.equal('23456X');
      });

      it('returns a 400 plus error message when title not provided', async () => {
        const res = await request(app)
          .post('/books')
          .send({
            author: 'Markus Zusak',
            genre: 'fiction',
            ISBN: '23456X'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('notNull Violation: Book.title cannot be null');
      });

      it('returns a 400 plus error message when author not provided', async () => {
        const res = await request(app)
          .post('/books')
          .send({
            title: 'The Book Thief',
            genre: 'fiction',
            ISBN: '23456X'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('notNull Violation: Book.author cannot be null');
      });

      it('returns a 400 plus error message when title blank', async () => {
        const res = await request(app)
          .post('/books')
          .send({
            title: '',
            author: 'Markus Zusak',
            genre: 'fiction',
            ISBN: '23456X'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Validation error: Validation notEmpty on title failed');
      });

      it('returns a 400 plus error message when author blank', async () => {
        const res = await request(app)
          .post('/books')
          .send({
            title: 'The Book Thief',
            author: '',
            genre: 'fiction',
            ISBN: '23456X'
          });
        
          expect(res.status).to.equal(400);
          expect(res.body.error).to.equal('Validation error: Validation notEmpty on author failed');
      });
    });
  });

  describe('with the database populated', () => {

    beforeEach(async () => {
      await Book.destroy({ where: {} });

      books = await Promise.all([
        Book.create({ title: faker.random.words(), author: faker.name.findName(), genre: faker.random.word(), ISBN: faker.random.alphaNumeric() }),
        Book.create({ title: faker.random.words(), author: faker.name.findName(), genre: faker.random.word(), ISBN: faker.random.alphaNumeric() }),
        Book.create({ title: faker.random.words(), author: faker.name.findName(), genre: faker.random.word(), ISBN: faker.random.alphaNumeric() }),
      ]);
    });

    describe('GET /books', () => {

      it('gets all book records', async () => {
        const res = await request(app).get('/books');
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(3);
        res.body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);
          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
          expect(book.ISBN).to.equal(expected.ISBN);
        });
      });

    });

    describe('GET /books/:bookId', () => {

      it('gets a book by id', async () => {
        const res = await request(app).get(`/books/${books[0].id}`);
        expect(res.status).to.equal(200);
        expect(res.body.title).to.equal(books[0].title);
        expect(res.body.author).to.equal(books[0].author);
        expect(res.body.genre).to.equal(books[0].genre);
        expect(res.body.ISBN).to.equal(books[0].ISBN);
      });

      it('returns a 404 if book id does not exist', async () => {
        const res = await request(app).get('/books/54321');
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The book could not be found.');
      });

    });

    describe('PATCH /books/:bookId', () => {

      it('updates book title by id', async () => {
        const newTitle = faker.random.words();
        while (newTitle === books[0].title) {
          newTitle = faker.random.words();
        }
        const res = await request(app)
          .patch(`/books/${books[0].id}`)
          .send({
            title: newTitle
          });
        
        const updatedBook = await Book.findByPk(books[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedBook.title).to.equal(newTitle);
        expect(updatedBook.author).to.equal(books[0].author);
        expect(updatedBook.genre).to.equal(books[0].genre);
        expect(updatedBook.ISBN).to.equal(books[0].ISBN);

      });

      it('updates book author by id', async () => {
        const newAuthor = faker.name.findName();
        while (newAuthor === books[0].author) {
          newAuthor = faker.name.findName();
        }
        const res = await request(app)
          .patch(`/books/${books[0].id}`)
          .send({
            author: newAuthor
          });
        
        const updatedBook = await Book.findByPk(books[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedBook.title).to.equal(books[0].title);
        expect(updatedBook.author).to.equal(newAuthor);
        expect(updatedBook.genre).to.equal(books[0].genre);
        expect(updatedBook.ISBN).to.equal(books[0].ISBN);
      });

      it('updates book genre by id', async () => {
        const newGenre = faker.random.word();
        while (newGenre === books[0].genre) {
          newGenre = faker.random.word();
        }
        const res = await request(app)
          .patch(`/books/${books[0].id}`)
          .send({
            genre: newGenre
          });
        
        const updatedBook = await Book.findByPk(books[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedBook.title).to.equal(books[0].title);
        expect(updatedBook.author).to.equal(books[0].author);
        expect(updatedBook.genre).to.equal(newGenre);
        expect(updatedBook.ISBN).to.equal(books[0].ISBN);
      });

      it('updates book ISBN by id', async () => {
        const newISBN = faker.random.alphaNumeric();
        while (newISBN === books[0].ISBN) {
          newISBN = faker.random.alphaNumeric();
        }
        const res = await request(app)
          .patch(`/books/${books[0].id}`)
          .send({
            ISBN: newISBN
          });
        
        const updatedGenre = await Book.findByPk(books[0].id, { raw: true });

        expect(res.status).to.equal(200);
        expect(updatedGenre.title).to.equal(books[0].title);
        expect(updatedGenre.author).to.equal(books[0].author);
        expect(updatedGenre.genre).to.equal(books[0].genre);
        expect(updatedGenre.ISBN).to.equal(newISBN);
      });

      it('returns a 404 if the book does not exist', async () => {
        const res = await request(app)
          .patch('/books/65432')
          .send({ title: "New Title" });

        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The book could not be found.');
      });

    });

    describe('DELETE /books/:bookId', () => {

      it('deletes book by id', async () => {
        const deletedBook = books[2];
        const res = await request(app)
          .delete(`/books/${deletedBook.id}`);

        expect(res.status).to.equal(204);
        const oldBook = await Book.findByPk(deletedBook.id, { raw: true });
        expect(oldBook).to.equal(null);
      });

      it('returns a 404 if the book could not be found', async () => {
        const res = await request(app)
          .delete('/books/65432');
        
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The book could not be found.');
      });

    });

  });

});