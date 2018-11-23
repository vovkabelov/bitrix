const { lockFilePath } = require('../constants');
const Repository = require('../entities/repository');

module.exports = new Repository(lockFilePath);