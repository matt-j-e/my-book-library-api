const express = require('express');
const router = express.Router();
const bookControllers = require('../controllers/books.js');

router
  .route('/')
  .get(bookControllers.getAll)
  .post(bookControllers.create);

router
  .route('/:bookId')
  .get(bookControllers.getById)
  .patch(bookControllers.updateById)
  .delete(bookControllers.deleteById)

module.exports = router;