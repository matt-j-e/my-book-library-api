const { Reader } = require('../models');

exports.create = (req, res) => {
  Reader.create(req.body)
    .then(newReader => res.status(201)
    .json(newReader));
};

exports.getAll = (req, res) => {
  Reader.findAll()
    .then(readers => res.status(200)
    .json(readers));
};

exports.getById = (req, res) => {
  Reader.findByPk(req.params.readerId)
    .then(reader => {
      if (!reader) res.status(404).json({  error: "The reader could not be found."});
      else res.status(200).json(reader);
    });
};

exports.updateById = (req, res) => {
  Reader.update(req.body, { where: { id: req.params.readerId } })
    .then(updatedRows => {
      if (updatedRows[0] === 0) res.status(404).json({ error: "The reader could not be found." });
      else res.status(200).json(updatedRows);
    });
};

exports.deleteById = (req, res) => {
  Reader.destroy({ where: { id: req.params.readerId } })
    .then(deletedRows => {
      if (!deletedRows) res.status(404).json({ error: "The reader could not be found." });
      else res.status(204).json(deletedRows);
    })
}