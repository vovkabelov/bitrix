const fs = require('fs');

class Repository {
	constructor(path) {
		this.path = path;
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, 'unlocked');
		}
	}

	lock() {
		fs.writeFileSync(this.path, 'locked');
	}

	unlock() {
		fs.writeFileSync(this.path, 'unlocked');
	}

	isLocked() {
		return fs.readFileSync(this.path, 'utf-8') === 'locked';
	}
}

module.exports = Repository;