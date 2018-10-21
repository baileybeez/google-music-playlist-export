// config.js

var config = {
	node: { }
}

switch (process.env.NODE_ENV) {
	default:
	case 'production':
		config.node.port = 3000
		break;
}
module.exports = config