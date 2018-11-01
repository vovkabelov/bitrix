import postcss from 'rollup-plugin-postcss-independed';
import autorpefixer from 'autoprefixer';
import json from 'rollup-plugin-json';
import reporter from 'rollup-plugin-reporter';
import babel from 'rollup-plugin-simple-babel';
import path from 'path';

let reporterOptions = {
	exclude: ['style.js']
};

if (process.argv.includes('--no-report'))
{
	reporterOptions.report = () => {};
}

module.exports = {
	output: {
		format: 'iife',
		sourcemap: true,
		extend: true,
		exports: 'named'
	},
	treeshake: true,
	plugins: [
		json(),
		postcss({
			extract: true,
			sourceMap: true,
			loaders: [],
			plugins: [
				autorpefixer({
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
};
