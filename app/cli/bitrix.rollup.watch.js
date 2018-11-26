const logSymbols = require('log-symbols');
const ora = require('ora');
const { isAllowed, isInput, isRepositoryRoot, getDirectories } = require('../utils');
const { build } = require('../tools/build');
const Directory = require('../entities/directory');
const path = require('path');
const chokidar = require('chokidar');
const repository = require('../process/repository');
const { lockFilePath } = require('../constants');
const slash = require('slash');

const argv = require('minimist')(process.argv.slice(2));
const currentDir = argv.path || argv.p || process.cwd();
let modules = argv.modules || argv.m;

if (modules && modules.length) {
	modules = modules.split(',')
		.map(module => module.trim())
		.filter(module => !!module);
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
			pattern.push(slash(path.resolve(currentConfig.context, '**/*.js')));
			pattern.push(slash(path.resolve(currentConfig.context, '**/*.css')));
			pattern.push(slash(path.resolve(currentConfig.context, '**/*.scss')));
		});
	}

	chokidar.watch(pattern)
		.on('ready', () => {
			watcherProgress.succeed(`Watcher is ready`.green.bold);
		})
		.on('change', (file) => {
			if (!repository.isLocked()) {
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
			}
		});

	chokidar.watch(lockFilePath)
		.on('change', () => {
			if (repository.isLocked()) {
				console.log('Watcher pause');
			} else {
				console.log('Watcher resume');
			}
		});
});