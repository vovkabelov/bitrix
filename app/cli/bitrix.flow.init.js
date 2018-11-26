const fs = require('fs');
const path = require('path');
const { binPath, currentDir } = require('../constants');

const configTemplatePath = path.resolve(binPath, './templates/.flowconfig');
const flowTypedPath = path.resolve(binPath, './templates/flow-typed');
const flowTypedDistPath = path.resolve(currentDir, 'flow-typed');
const defaultDistPath = path.resolve(currentDir, '.flowconfig');
const argv = require('minimist')(process.argv.slice(2));

const distPath = argv.p || argv.path || defaultDistPath;

fs.symlink(configTemplatePath, distPath, () => {});
fs.symlink(flowTypedPath, flowTypedDistPath, () => {});