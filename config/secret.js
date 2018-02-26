if (process.env.NODE_ENV === 'production') {
	module.exports = require('./prod'); // export prod keys
}
else {
	module.exports = require('./dev'); // export dev keys
}
