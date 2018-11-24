const argv = require('minimist')(process.argv.slice(2));

const command = argv._[0] || 'help';

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

	case 'help':
	default:
		console.log('help');
		break;
}