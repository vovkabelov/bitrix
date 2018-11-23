const postcss = require('rollup-plugin-postcss-independed');
const autoprefixer = require('autoprefixer');
const json = require('rollup-plugin-json');
const reporter = require('rollup-plugin-reporter');
const babel = require('rollup-plugin-simple-babel');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const bitrixReporter = require('./app/reporters/bitrix.reporter');

let reporterOptions = {
	exclude: ['style.js'],
	report: bitrixReporter
};

if (argv.report === false) {
	reporterOptions.report = () => {};
}

module.exports = {
	input: {
		external: ['BX'],
		treeshake: true,
		plugins: [
			json(),
			postcss({
				extract: true,
				sourceMap: true,
				loaders: [],
				plugins: [
					autoprefixer({
						browsers: [
							'ie >= 11',
							'last 4 version'
						]
					})
				]
			}),
			babel({
				sourceMaps: true,
				presets: [
					path.resolve(__dirname, './node_modules/@babel/preset-env'),
					path.resolve(__dirname, './node_modules/@babel/preset-react')
				],
				plugins: [
					path.resolve(__dirname, './node_modules/@babel/plugin-external-helpers'),
					path.resolve(__dirname, './node_modules/@babel/plugin-transform-flow-strip-types'),
					path.resolve(__dirname, './node_modules/@babel/plugin-proposal-class-properties')
				]
			}),
			reporter(reporterOptions)
		]
	},
	output: {
		format: 'iife',
		sourcemap: true,
		extend: true,
		exports: 'named',
		globals: {
			'BX': true
		}
	}
};
