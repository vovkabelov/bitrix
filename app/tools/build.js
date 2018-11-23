const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { rollup } = require('rollup');
const { extendsConfig,
	isModulePath, generateConfigPhp } = require('../../app/utils');
const { binPath } = require('../../app/constants');
const Directory = require('../../app/entities/directory');

async function build(dir) {
	if (Array.isArray(dir)) {
		for (let item of dir) {
			console.log(`Build module ${item}`.bold);
			await buildDirectory(item);
		}
	}
	else
	{
		await buildDirectory(dir);
	}
}

async function buildDirectory(dir) {
	const directory = new Directory(dir);
	const configs = directory.getConfigs();
	global.currentDirectory = path.resolve(dir);

	for (const config of configs) {
		// @todo refactor this
		delete require.cache[path.resolve(binPath, '../rollup.config.js')];
		const rollupConfig = require('../../rollup.config');

		const { input, output } = extendsConfig(rollupConfig, config);

		// Build
		const bundle = await rollup(input);
		await bundle.write(output);

		// Generate config.php if needed
		if (isModulePath(input.input) || fs.existsSync(path.resolve(config.context, 'bundle.config.js'))) {
			if (!fs.existsSync(path.resolve(config.context, 'config.php'))) {
				let configPhp = generateConfigPhp(config);
				fs.writeFileSync(path.resolve(config.context, 'config.php'), configPhp, () => {});
			}
		}
	}
}

module.exports = {
	build
};