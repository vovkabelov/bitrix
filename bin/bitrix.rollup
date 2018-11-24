#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const { isRepositoryRoot, getDirectories } = require('../app/utils');
const { build } = require('../app/tools/build');

const currentDir = argv.path || argv.p || argv._[0] || process.cwd();
let modules = argv.modules || argv.m;

if (modules && modules.length) {
	modules = modules.split(',').map(module => module.trim());
}

if (isRepositoryRoot(currentDir)) {
	void build(modules || getDirectories(currentDir));
} else {
	void build(currentDir);
}