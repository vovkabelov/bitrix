const path = require('path');

const binPath = __dirname;
const modulesPath = path.resolve(binPath, '../node_modules/');
const rollupPath = path.resolve(binPath, '../node_modules/rollup/bin/rollup');
const mochaPath = path.resolve(binPath, '../node_modules/mocha/bin/mocha');
const mochaBootstrapPath = path.resolve(binPath, '../app/test.bootstrap.js');
const babelConfigPath = path.resolve(binPath, '../.babelrc');
const rollupConfigPath = path.resolve(binPath, '../rollup.config.js');
const currentDir = process.env.PWD;
const lockFilePath = path.resolve(binPath, '../.bitrix.lock');

module.exports = {
	pwd: currentDir,
	binPath,
	mochaPath,
	mochaBootstrapPath,
	currentDir,
	babelConfigPath,
	rollupConfigPath,
	modulesPath,
	rollupPath,
	lockFilePath
};