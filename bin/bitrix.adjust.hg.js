#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const ini = require('ini');
const path = require('path');
const { binPath } = require('../app/constants');


const hgrcPath = path.resolve(os.homedir(), '.hgrc');
let hgrc = {};

if (fs.existsSync(hgrcPath)) {
	hgrc = ini.parse(fs.readFileSync(hgrcPath, 'utf-8'));
}

if (!('hooks' in hgrc)) {
	hgrc.hooks = {};
}

hgrc.hooks['preupdate.bitrix.rollup.watcher'] = 'node ' + path.resolve(binPath, 'shell/preupdate.js');
hgrc.hooks['update.bitrix.rollup.watcher'] = 'node ' + path.resolve(binPath, 'shell/update.js');

const encodedHgrc = ini.encode(hgrc);

console.log(encodedHgrc);

fs.writeFileSync(hgrcPath, encodedHgrc);