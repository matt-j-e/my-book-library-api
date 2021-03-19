const { Book } = require('../models');
const helpers = require('./helpers');

exports.create = (req, res) => helpers.createItem('book', res, req.body);

exports.getAll = (req, res) => helpers.getAllItems('book', res);

exports.getById = (req, res) => helpers.getItemById('book', res, req.params.bookId);

exports.updateById = (req, res) => helpers.updateItem('book', res, req.body, req.params.bookId);

exports.deleteById = (req, res) => helpers.deleteItem('book', res, req.params.bookId);