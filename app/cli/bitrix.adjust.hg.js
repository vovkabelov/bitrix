const fs = require('fs');
const os = require('os');
const ini = require('ini');
const path = require('path');
const colors = require('colors');
const { binPath } = require('../constants');

const hgrcPath = path.resolve(os.homedir(), '.hgrc');
let hgrc = {};

if (fs.existsSync(hgrcPath)) {
	if (!fs.existsSync(`${hgrcPath}.backup`)) {
		fs.copyFileSync(hgrcPath, `${hgrcPath}.backup`);
	}

	hgrc = ini.parse(fs.readFileSync(hgrcPath, 'utf-8'));
}

if (!('hooks' in hgrc)) {
	hgrc.hooks = {};
}

hgrc.hooks['preupdate.bitrix.rollup.watcher'] = `/bin/sh bitrix system:lock`;
hgrc.hooks['update.bitrix.rollup.watcher'] = `/bin/sh bitrix system:unlock`;

const encodedHgrc = ini.encode(hgrc);

try {
	fs.writeFileSync(hgrcPath, encodedHgrc);
	console.log(`~/.hgrc updated`.green.bold);
} catch (err) {
	console.error(err);
}
