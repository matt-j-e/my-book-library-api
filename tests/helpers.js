const { Genre, Author } = require('../src/models');
const faker = require('faker');

const getModel = (model) => {
    const models = {
        author: Author,
        genre: Genre,
    };
    return models[model];
}

const testData = (model) => {
    const Model = getModel(model);
    let testItems = [];
    for (let i = 0; i < 3; i++) {
        testItems.push(Model.create({ name: faker.name.findName() }));
    }
    return testItems;
}

module.exports = {
    testData,
}