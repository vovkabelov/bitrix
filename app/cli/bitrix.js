const argv = require('minimist')(process.argv.slice(2));
const pkg = require('../../package');
const colors = require('colors');

const command = (
	((argv.version || argv.v) ? 'version' : '') ||
	((argv.help || argv.h) ? 'help' : '') ||
	argv._[0] ||
	'help'
);

switch (command) {
	case 'rollup':
		require('./bitrix.rollup');
		break;

	case 'rollup:watch':
		require('./bitrix.rollup.watch');
		break;

	case 'flow:init':
		require('./bitrix.flow.init');
		break;

	case 'test':
		require('./bitrix.test');
		break;

	case 'adjust:hg':
		require('./bitrix.adjust.hg');
		break;

	case 'version':
		console.log(pkg.name, pkg.version);
		break;

	case 'help':
	default:
		console.log(`
    ${colors.bold('Usage:')} bitrix <command> [options]

    ${colors.bold('Commands:')}
      ${colors.bold('Bundler commands')}
      rollup             Builds all bundles from current directory
      rollup:watch       Runs file change watcher for current directory
      Options:
        -m, --modules      Run command for favorite modules
        -p, --path         Runs command for path 
      ${colors.gray('----------------------------------------------------------------')}
      ${colors.bold('Technology use')}
      flow:init          Initializes Flow tech for current directory
      typescript:init    (soon) Initializes TypeScript tech for current directory
      ${colors.gray('----------------------------------------------------------------')}
      ${colors.bold('Adjusts')}
      adjust:hg          Adds Mercurial events handlers for all repositories.
                         The command modifies file ~/.hgrc. Before modification, 
                         a backup copy of the file with the name will be created .hgrc.backup
      ${colors.gray('----------------------------------------------------------------')}
      ${colors.bold('Testing')}
      test               Runs test from ./test directory
		`);
		break;
}