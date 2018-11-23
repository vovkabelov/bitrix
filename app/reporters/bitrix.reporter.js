const colors = require('colors');
const logSymbols = require('log-symbols');
const { isModulePath, buildExtensionName,
	isComponentPath, buildComponentName,
	isTemplatePath, buildTemplateName } = require('../../app/utils');
const { resolve } = require('path');
const Directory = require('../../app/entities/directory');

const argv = require('minimist')(process.argv.slice(2));

module.exports = function(bundle) {
	const directory = new Directory(global.currentDirectory || argv.path || argv.p || argv._[0] || process.cwd());
	const configs = directory.getConfigs();
	let input = resolve(process.cwd(), bundle.bundle);
	let config = configs.find(currentConfig => {
		return resolve(currentConfig.context, currentConfig.output).endsWith(bundle.bundle);
	});

	if (isModulePath(input)) {
		let name = buildExtensionName(input, config.context);
		console.log(` ${logSymbols.success} Build extension ${name}`);
	}

	if (isComponentPath(input)) {
		let name = buildComponentName(input);
		console.log(` ${logSymbols.success} Build component ${name}`);
	}

	if (isTemplatePath(input)) {
		let name = buildTemplateName(input);
		console.log(` ${logSymbols.success} Build template ${name}`);
	}
};