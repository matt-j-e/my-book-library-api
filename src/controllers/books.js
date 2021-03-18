const { Book } = require('../models');

exports.create = (req, res) => {
  Book.create(req.body)
    .then(newBook => res.status(201)
    .json(newBook))
    .catch(error => {
        console.log(error.message);
        res.status(400)
      .json({ error: error.message });
    })
};

exports.getAll = (req, res) => {
  Book.findAll()
    .then(books => res.status(200)
    .json(books));
};

exports.getById = (req, res) => {
  Book.findByPk(req.params.bookId)
    .then(book => {
      if (!book) res.status(404).json({  error: "The book could not be found."});
      else res.status(200).json(book);
    });
};

exports.updateById = (req, res) => {
  Book.update(req.body, { where: { id: req.params.bookId } })
    .then(updatedRows => {
      if (updatedRows[0] === 0) res.status(404).json({ error: "The book could not be found." });
      else res.status(200).json(updatedRows);
    });
};

exports.deleteById = (req, res) => {
  Book.destroy({ where: { id: req.params.bookId } })
    .then(deletedRows => {
      if (!deletedRows) res.status(404).json({ error: "The book could not be found." });
      else res.status(204).json(deletedRows);
    })
};