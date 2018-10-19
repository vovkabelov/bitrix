#!/usr/bin/env node

let {
	binPath,
	currentDir,
	rollupConfigPath
} = require('../app/constants');

const { getConfigs, buildConfigBundlePath } = require('../app/utils');
const { exec } = require('shelljs');
const path = require('path');
const { renderTemplateFile } = require('template-file');
const fs = require('fs');

const customDir = process.argv[2];

if (customDir) {
	currentDir = customDir;
}

getConfigs(currentDir).forEach(config => {
	let {input, output, name, context} = config;
	let treeshake = `--${config.treeshake === false ? 'no-' : ''}treeshake`;
	let noReport = process.argv.includes('--no-report') ? '--no-report' : '';

	input = path.resolve(context, input);
	output = path.resolve(context, output);

	exec(`rollup -c ${rollupConfigPath} -i ${input} -o ${output} ${name ? '-n '+name : ''} ${treeshake} --silent ${noReport}`);

	if (input.includes('script.es6.js')) {
		if (fs.existsSync(path.resolve(context, 'style.scss'))) {
			let styleJsTemplate = path.resolve(binPath, '../app/templates/style.js');
			let styleJsPath = path.resolve(context, './style.js');

			fs.copyFileSync(styleJsTemplate, styleJsPath, () => {});

			exec(`rollup -c ${rollupConfigPath} -i ${styleJsPath} -o ${styleJsPath} --n ${name} --no-treeshake --silent`, () => {
				fs.unlinkSync(styleJsPath);
			});
		}
		return;
	}

	if (!fs.existsSync(path.resolve(context, 'config.php'))) {
		renderTemplateFile(path.resolve(binPath, '../app/templates/config.php'), {
			cssPath: buildConfigBundlePath(output, 'css'),
			jsPath: buildConfigBundlePath(output, 'js')
		})
		.then(result => {
			fs.writeFileSync(path.resolve(context, 'config.php'), result, () => {

			});
		});
	}
});