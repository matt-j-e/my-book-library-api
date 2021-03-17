const express = require('express');
const router = express.Router();
const readerControllers = require('../controllers/readers.js');

router
  .route('/')
  .get(readerControllers.getAll)
  .post(readerControllers.create);

router
  .route('/:readerId')
  .get(readerControllers.getById)
  .patch(readerControllers.updateById)
  .delete(readerControllers.deleteById)

module.exports = router;