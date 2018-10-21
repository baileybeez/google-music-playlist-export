// config.js

var config = {
	api: { },
	node: { }
}

config.api.secret = '<app_secret>'
config.api.path = './api_modules'

switch (process.env.NODE_ENV) {
	default:
	case 'production':
		config.node.port = process.env.WEB_PORT || 3000
		break;
}
module.exports = config