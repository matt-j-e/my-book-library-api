const { Reader } = require('../models');

exports.create = (req, res) => {
  Reader.create(req.body)
    .then(newReader => res.status(201)
    .json(newReader));
};