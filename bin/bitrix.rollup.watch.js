#!/usr/bin/env node

const watch = require('watch');
const { exec } = require('shelljs');
const { isAllowed, isInput } = require('../app/utils');

const binPath = process.env.PWD;
const watchOptions = {
	interval: .5,
	async: true
};

watch.watchTree(binPath, watchOptions, (file) => {
	let changedFiles = [file];

	if (typeof file === 'object') {
		exec(`bitrix:rollup`);
		return;
	}

	let isAllowedChanges = changedFiles.some(filePath => (
		isAllowed(filePath) && isInput(binPath, filePath)
	));

	if (isAllowedChanges)
	{
		exec(`bitrix:rollup`);
	}
});