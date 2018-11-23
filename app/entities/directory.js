class Directory {
	constructor(dir) {
		this.location = dir;
	}

	getConfigs() {
		if (!Directory.configs.has(this.location)) {
			const { getConfigs } = require('../utils');
			Directory.configs.set(this.location, getConfigs(this.location));
			Directory.configs.get(this.location).forEach(config => {
				let configs = Directory.configs.get(this.location).filter(childConfig => {
					return config.context.includes(childConfig.context);
				});

				if (configs.length) {
					Directory.configs.set(config.context, configs);
				}
			});
		}

		return Directory.configs.get(this.location);
	}
}

Directory.configs = new Map();

module.exports = Directory;