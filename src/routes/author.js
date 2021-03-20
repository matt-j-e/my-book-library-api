const express = require('express');
const router = express.Router();
const authorControllers = require('../controllers/authors.js');

router
  .route('/')
  .get(authorControllers.getAll)
  .post(authorControllers.create);

router
  .route('/:authorId')
  .get(authorControllers.getById)
  .patch(authorControllers.updateById)
  .delete(authorControllers.deleteById)

module.exports = router;