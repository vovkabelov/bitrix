#!/usr/bin/env node

const watch = require('watch');
const logSymbols = require('log-symbols');
const ora = require('ora');
const { isAllowed, isInput, isRepositoryRoot, getDirectories } = require('../app/utils');
const { build } = require('../app/tools/build');
const Directory = require('../app/entities/directory');
const path = require('path');
const chokidar = require('chokidar');

const argv = require('minimist')(process.argv.slice(2));
const currentDir = argv.path || argv.p || argv._[0] || process.cwd();
let modules = argv.modules || argv.m;

if (modules && modules.length) {
	modules = modules.split(',').map(module => module.trim());
}

let buildPromise;

if (isRepositoryRoot(currentDir)) {
	buildPromise = build(modules || getDirectories(currentDir));
} else {
	buildPromise = build(currentDir);
}

buildPromise.then(() => {
	let directories;

	if (isRepositoryRoot(currentDir)) {
		directories = modules || getDirectories(currentDir);
	} else {
		directories = [currentDir];
	}

	let pattern = [];

	const watcherProgress = ora('Run watcher').start();

	for (const dir of directories) {
		let directory = new Directory(dir);
		let directoryConfigs = directory.getConfigs();
		directoryConfigs.forEach(currentConfig => {
			pattern.push(path.resolve(currentConfig.context, '**/*.js'));
			pattern.push(path.resolve(currentConfig.context, '**/*.css'));
			pattern.push(path.resolve(currentConfig.context, '**/*.scss'));
		});
	}

	chokidar.watch(pattern)
		.on('ready', () => {
			watcherProgress.succeed(`Watcher is ready`.green.bold);
		})
		.on('change', (file) => {
			let isAllowedChanges = directories
				.every(dir => isAllowed(file) && isInput(dir, file));

			if (isAllowedChanges) {
				let changedConfig = directories
					.reduce((acc, dir) => acc.concat((new Directory(dir)).getConfigs()), [])
					.find(config => path.resolve(file).includes(config.context));

				if (changedConfig) {
					build(path.resolve(changedConfig.context));
				}
			}
		});
});