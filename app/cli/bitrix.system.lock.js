#!/usr/bin/env node

const repository = require('../process/repository');
repository.lock();
console.log(`Watcher pause`);