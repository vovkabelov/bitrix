#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { binPath, currentDir } = require('../app/constants');

const configTemplatePath = path.resolve(binPath, '../app/templates/.flowconfig');
const flowTypedPath = path.resolve(binPath, '../app/templates/flow-typed');
const flowTypedDistPath = path.resolve(currentDir, 'flow-typed');
const defaultDistPath = path.resolve(currentDir, '.flowconfig');
const customDistPath = process.argv[2];
const distPath = customDistPath || defaultDistPath;

fs.symlink(configTemplatePath, distPath, () => {});
fs.symlink(flowTypedPath, flowTypedDistPath, () => {});