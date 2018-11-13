#!/usr/bin/env node

const watch = require('watch');
const { exec } = require('shelljs');
const { isAllowed, isInput, getConfigs } = require('../app/utils');

const binPath = process.env.PWD;
const watchOptions = {
	interval: .5,
	async: true
};

watch.watchTree(binPath, watchOptions, (file) => {
	if (typeof file === 'object') {
		exec(`bitrix:rollup`);
		return;
	}

	let isAllowedChanges = (
		isAllowed(file) && isInput(binPath, file)
	);

	if (isAllowedChanges)
	{
		let changedConfig = getConfigs(binPath).find(config => file.includes(config.context));

		if (changedConfig) {
			exec(`bitrix:rollup ${changedConfig.context}`);
		}
	}
});