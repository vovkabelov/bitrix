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

require('../public/babel-external-helpers');
require('../public/base-polyfill');
