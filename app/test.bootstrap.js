global.assert = require('assert');
global.describe = require('mocha').describe;
global.it = require('mocha').it;
global.xit = require('mocha').xit;
global.before = require('mocha').before;
global.beforeEach = require('mocha').beforeEach;
global.after = require('mocha').after;
global.afterEach = require('mocha').afterEach;
global.setup = require('mocha').setup;
global.suite = require('mocha').suite;
global.suiteSetup = require('mocha').suiteSetup;
global.suiteTeardown = require('mocha').suiteTeardown;
global.teardown = require('mocha').teardown;
global.test = require('mocha').test;
global.run = require('mocha').run;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const DOM = new JSDOM(``, {
	url: 'https://example.org/',
	referrer: 'https://example.com/',
	contentType: 'text/html',
	includeNodeLocations: true,
	storageQuota: 10000000
});

global.window = DOM.window;
global.document = DOM.window.document;
global.Node = DOM.window.Node;
global.Element = DOM.window.Element;

Object.keys(DOM.window).forEach((property) => {
	if (typeof global[property] === 'undefined') {
		global[property] = DOM.window[property];
	}
});

global.navigator = {
	userAgent: 'node.js'
};

const {currentDir} = require('./constants');
const fs = require('fs');
const path = require('path');

function tryIncludeCoreJs(corePath) {
	let baseCorePath = 'main/install/js/main/core/es6';
	let alternativePath = 'bitrix/js/main/core/es6';
	let newPath = path.resolve(corePath, baseCorePath);

	if (fs.existsSync(newPath)) {
		return newPath;
	}

	if (fs.existsSync(alternativePath)) {
		return alternativePath;
	}

	return tryIncludeCoreJs(path.resolve(corePath, '../'));
}

let corePath = tryIncludeCoreJs(path.resolve(currentDir));

require(path.resolve(corePath, 'lib/base-polyfill'));
require(path.resolve(corePath, 'lib/babel-external-helpers'));
require(path.resolve(corePath, 'dist/bundle.core-init'));
const {BX} = require(path.resolve(corePath, 'dist/bundle.core'));

Object.keys(BX).forEach(function (key) {
	return window.BX[key] = BX[key];
});

global.BX = window.BX;
require(path.resolve(corePath, '../core.js'));