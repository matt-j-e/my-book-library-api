const express = require('express');
const router = express.Router();
const genreControllers = require('../controllers/genres.js');

router
  .route('/')
  .get(genreControllers.getAll)
  .post(genreControllers.create);

router
  .route('/:genreId')
  .get(genreControllers.getById)
  .patch(genreControllers.updateById)
  .delete(genreControllers.deleteById)

module.exports = router;