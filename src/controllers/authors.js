const { Author } = require('../models');
// const { createItem } = require('./helpers');
const helpers = require('./helpers');

exports.create = (req, res) => helpers.createItem('author', res, req.body);

exports.getAll = (req, res) => helpers.getAllItems('author', res);

exports.getById = (req, res) => helpers.getItemById('author', res, req.params.authorId);

exports.updateById = (req, res) => helpers.updateItem('author', res, req.body, req.params.authorId);

exports.deleteById = (req, res) => helpers.deleteItem('author', res, req.params.authorId);