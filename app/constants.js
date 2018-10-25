const path = require('path');

const binPath = __dirname;
const modulesPath = path.resolve(binPath, '../node_modules/');
const mochaPath = path.resolve(binPath, '../node_modules/mocha/bin/mocha');
const mochaBootstrapPath = path.resolve(binPath, '../app/test.bootstrap.js');
const babelConfigPath = path.resolve(binPath, '../.babelrc');
const rollupConfigPath = path.resolve(binPath, '../rollup.config.js');
const currentDir = process.env.PWD;

module.exports = {
	binPath,
	mochaPath,
	mochaBootstrapPath,
	currentDir,
	babelConfigPath,
	rollupConfigPath,
	modulesPath
};