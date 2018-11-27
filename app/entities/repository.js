const fs = require('fs');

class Repository {
	constructor(path) {
		this.path = path;
		if (!fs.existsSync(path)) {
			fs.writeFileSync(path, '');
		}
	}

	isLocked(filePath) {
		return fs.readFileSync(this.path, 'utf-8')
			.split('\n')
			.some(repoPath => !!repoPath && filePath.includes(repoPath));
	}
}

module.exports = Repository;