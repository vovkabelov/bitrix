#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const { isRepositoryRoot, getDirectories } = require('../utils');
const { build } = require('../tools/build');

const currentDir = argv.path || argv.p || process.cwd();
let modules = argv.modules || argv.m;

if (modules && modules.length) {
	modules = modules.split(',')
		.map(module => module.trim())
		.filter(module => !!module);
}

if (isRepositoryRoot(currentDir)) {
	void build(modules || getDirectories(currentDir));
} else {
	void build(currentDir);
}