#!/usr/bin/env node

const repository = require('../process/repository');
repository.unlock();
console.log(`Watcher resume`);