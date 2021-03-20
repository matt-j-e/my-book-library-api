const { Genre } = require('../models');
// const { createItem } = require('./helpers');
const helpers = require('./helpers');

exports.create = (req, res) => helpers.createItem('genre', res, req.body);

exports.getAll = (req, res) => helpers.getAllItems('genre', res);

exports.getById = (req, res) => helpers.getItemById('genre', res, req.params.genreId);

exports.updateById = (req, res) => helpers.updateItem('genre', res, req.body, req.params.genreId);

exports.deleteById = (req, res) => helpers.deleteItem('genre', res, req.params.genreId);