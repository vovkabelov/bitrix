'use strict';

const glob = require('glob');
const path = require('path');

/**
 * @param dir
 * @return {object[]}
 */
const getConfigs = (dir) => {
	let extsConfig = glob.sync(path.resolve(dir, '**/bundle.config.js'), {dot: true})
		.reduce((accumulator, configPath) => {
			let config = require(path.resolve(dir, configPath));
			let configDir = path.dirname(path.resolve(dir, configPath));

			if (!Array.isArray(config)) {
				config = [config];
			}

			config.forEach(currentConfig => {
				accumulator.push({
					input: currentConfig.input ? currentConfig.input : '',
					output: currentConfig.output ? currentConfig.output : '',
					name: currentConfig.namespace ? currentConfig.namespace : '',
					treeshake: currentConfig.treeshake !== false,
					context: configDir
				});
			});

			return accumulator;
		}, []);

	let components = glob.sync(path.resolve(dir, '**/script.es6.js'), {dot: true})
		.reduce((accumulator, configPath) => {
			let config = require(path.resolve(dir, configPath));
			let configDir = path.dirname(path.resolve(dir, configPath));

			if (!Array.isArray(config)) {
				config = [config];
			}

			config.forEach(currentConfig => {
				accumulator.push({
					input: path.resolve(configDir, 'script.es6.js'),
					output: path.resolve(configDir, 'script.js'),
					treeshake: currentConfig.treeshake !== false,
					context: configDir
				});
			});

			return accumulator;
		}, []);

	let tests = glob.sync(path.resolve(dir, '**/*.test.es6.js'), {dot: true})
		.reduce((accumulator, configPath) => {
			let config = {
				input: configPath,
				output: configPath.replace('.es6.js', '.es5.js')
			};
			let configDir = path.dirname(path.resolve(dir, configPath));

			if (!Array.isArray(config)) {
				config = [config];
			}

			config.forEach(currentConfig => {
				accumulator.push({
					input: path.resolve(currentConfig.input),
					output: path.resolve(currentConfig.output),
					treeshake: currentConfig.treeshake !== false,
					context: configDir
				});
			});

			return accumulator;
		}, []);

	return [].concat([], extsConfig, components, tests);
};

/**
 * @param fileName
 * @return {boolean}
 */
const isAllowed = (fileName) => {
	if (!fileName) {
		return false;
	}

	if ((new RegExp('\/components\/(.*)\/style.js')).test(fileName) ||
		(new RegExp('\/components\/(.*)\/style.css')).test(fileName))
	{
		return false;
	}

	let ext = path.extname(fileName);

	switch (ext) {
		case '.js':
		case '.jsx':
		case '.css':
		case '.scss':
			return true;
		default:
			return false;
	}
};

/**
 * @param dir
 * @param fileName
 * @return {Boolean}
 */
const isInput = (dir, fileName) => {
	return getConfigs(dir).every(config => {
		return fileName.includes(config.context) &&
			!fileName.includes(path.normalize(config.output)) &&
			!fileName.includes(path.normalize(config.output.replace('.js', '.css')))
	});
};

const isModulePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/js\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2] && res[1] === res[2];
};

const buildModulePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/js\/(.[a-z0-9]+)\/'));
	return `/bitrix/js/${res[1]}/${filePath.split(res[0])[1]}`;
};

const isComponentPath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/components\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2];
};

const buildComponentPath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/components\/(.[a-z0-9]+)\/'));
	return `/bitrix/components/${res[2]}/${filePath.split(res[0])[1]}`;
};

const isTemplatePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/templates\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2];
};

const buildTemplatePath = (filePath) => {
	return `/bitrix/templates/${filePath.split('install/templates/')[1]}`;
};

const buildConfigBundlePath = (filePath, ext) => {
	if (isModulePath(filePath)) {
		filePath = buildModulePath(filePath);
	}

	if (isComponentPath(filePath)) {
		filePath = buildComponentPath(filePath);
	}

	if (isTemplatePath(filePath)) {
		filePath = buildTemplatePath(filePath);
	}

	if (ext === 'js') {
		return filePath.replace('.css', '.js');
	}

	if (ext === 'css') {
		return filePath.replace('.js', '.css');
	}

	return filePath;
};

module.exports = {
	getConfigs: getConfigs,
	isAllowed: isAllowed,
	isInput: isInput,
	buildConfigBundlePath: buildConfigBundlePath
};