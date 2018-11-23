'use strict';

const glob = require('fast-glob');
const path = require('path');
const { binPath } = require('./constants');
const mustache = require('mustache');
const fs = require('fs');
const Directory = require('../app/entities/directory');

/**
 * @param dir
 * @return {object[]}
 */
const getConfigs = (dir) => {
	let extsConfig = glob.sync([
		path.resolve(dir, '**/bundle.config.js'),
		path.resolve(dir, '**/script.es6.js')
	], {
		dot: true,
		cache: true,
		followSymlinkedDirectories: false,
		unique: false
	})
		.reduce((accumulator, configPath) => {
			let config = '';
			let configDir = path.dirname(path.resolve(dir, configPath));

			if (configPath.includes('script.es6.js')) {
				config = {
					input: path.resolve(configDir, 'script.es6.js'),
					output: path.resolve(configDir, 'script.js')
				};
			}
			else
			{
				config = require(path.resolve(dir, configPath));
			}

			if (!Array.isArray(config)) {
				config = [config];
			}

			config.forEach(currentConfig => {
				let relativities = [];

				if (Array.isArray(currentConfig.rel)) {
					relativities = currentConfig.rel;
				}

				if (!!currentConfig.rel && typeof currentConfig.rel === 'string') {
					relativities = [currentConfig.rel];
				}

				accumulator.push({
					input: currentConfig.input ? currentConfig.input : '',
					output: currentConfig.output ? currentConfig.output : '',
					name: currentConfig.namespace ? currentConfig.namespace : '',
					treeshake: currentConfig.treeshake !== false,
					context: configDir,
					rel: relativities
				});
			});

			return accumulator;
		}, []);

	return [].concat([], extsConfig);
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
	return (new Directory(dir)).getConfigs().every(config => {
		return !fileName.includes(path.normalize(config.output)) &&
			!fileName.includes(path.normalize(config.output.replace('.js', '.css')))
	});
};

const isModulePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/js\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2];
};

const buildModulePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/js\/(.[a-z0-9]+)\/'));
	return `/bitrix/js/${res[1]}/${filePath.split(res[0])[1]}`;
};

const buildExtensionName = (filePath, context) => {
	let regExp = new RegExp('\/(.[a-z0-9]+)\/install\/js\/(.[a-z0-9]+)\/');
	let res = filePath.match(regExp);
	let fragments = context.split(`${res[1]}/install/js/${res[2]}/`);

	return `${res[2]}.${fragments[fragments.length-1].split(path.sep).join('.')}`;
};

const isComponentPath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/components\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2];
};

const buildComponentPath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/components\/(.[a-z0-9]+)\/'));
	return `/bitrix/components/${res[2]}/${filePath.split(res[0])[1]}`;
};

const buildComponentName = (filePath) => {
	let regExp = new RegExp('\/(.[a-z0-9]+)\/install\/components\/(.[a-z0-9]+)\/');
	let res = filePath.match(regExp);
	return `${res[2]}:${filePath.split(res[0])[1].split(path.sep)[0]}`;
};

const isTemplatePath = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/templates\/(.[a-z0-9]+)\/'));
	return !!res && !!res[1] && !!res[2];
};

const buildTemplatePath = (filePath) => {
	return `/bitrix/templates/${filePath.split('install/templates/')[1]}`;
};

const buildTemplateName = (filePath) => {
	let res = filePath.match(new RegExp('\/(.[a-z0-9]+)\/install\/templates\/(.[a-z0-9]+)\/'));
	return res && res[2];
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

function extendsConfig(base, config) {
	let input = Object.assign({}, base.input, {
		input: path.resolve(config.context, config.input),
		treeshake: config.treeshake !== false
	});
	let output = Object.assign({}, base.output, {
		file: path.resolve(config.context, config.output),
		name: config.namespace || 'window',
		sourcemapPathTransform: () => ''
	});

	return {input, output};
}

function generateConfigPhp(config) {
	return mustache.render(
		fs.readFileSync(path.resolve(binPath, '../app/templates/config.php'), 'utf-8'),
		{
			cssPath: buildConfigBundlePath(path.resolve(config.context, config.output), 'css'),
			jsPath: buildConfigBundlePath(path.resolve(config.context, config.output), 'js'),
			rel: config.rel.map((item, i) => `${!i ? '\n' : ''}\t\t"${item}"`).join(',\n') + `${config.rel.length ? '\n\t' : ''}`
		}
	)
}

function getDirectories(dir) {
	const pattern = path.resolve(dir, '**');
	const options = {onlyDirectories: true, deep: 0};

	return glob.sync(pattern, options)
		.map(dirPath => path.basename(dirPath));
}

function isRepositoryRoot(dirPath) {
	let dirs = getDirectories(dirPath);

	return (
		dirs.includes('main') &&
		dirs.includes('fileman') &&
		dirs.includes('iblock') &&
		dirs.includes('ui') &&
		dirs.includes('translate')
	);
}

module.exports = {
	extendsConfig,
	getConfigs,
	isAllowed,
	isInput,
	buildConfigBundlePath,
	isModulePath,
	generateConfigPhp,
	buildExtensionName,
	isComponentPath,
	buildComponentName,
	isTemplatePath,
	buildTemplateName,
	isRepositoryRoot,
	getDirectories
};