const colors = require('colors');
const fs = require('fs');
const path = require('path');
const { rollup } = require('rollup');
const { extendsConfig,
	isModulePath, generateConfigPhp, buildConfigBundlePath } = require('../../app/utils');
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

		let cssMapPath = path.resolve(config.context, `${config.output.replace('.js', '.css')}.map`);

		if (fs.existsSync(cssMapPath)) {
			adjustSourceMap(cssMapPath, config.context);
		}

		// Generate config.php if needed
		if (isModulePath(input.input) || fs.existsSync(path.resolve(config.context, 'bundle.config.js'))) {
			if (!fs.existsSync(path.resolve(config.context, 'config.php'))) {
				let configPhp = generateConfigPhp(config);
				fs.writeFileSync(path.resolve(config.context, 'config.php'), configPhp, () => {});
			}
		}
	}
}

function adjustSourceMap(mapPath, context) {
	let map = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
	map.sources = map.sources.map(sourcePath => {
		return buildConfigBundlePath(path.relative(mapPath, sourcePath));
	});
	fs.writeFileSync(mapPath, JSON.stringify(map));
}

module.exports = {
	build
};