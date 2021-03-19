const { Reader } = require('../models');
// const { createItem } = require('./helpers');
const helpers = require('./helpers');

exports.create = (req, res) => helpers.createItem('reader', res, req.body);

exports.getAll = (req, res) => helpers.getAllItems('reader', res);

exports.getById = (req, res) => helpers.getItemById('reader', res, req.params.readerId);

exports.updateById = (req, res) => helpers.updateItem('reader', res, req.body, req.params.readerId);

exports.deleteById = (req, res) => helpers.deleteItem('reader', res, req.params.readerId);
