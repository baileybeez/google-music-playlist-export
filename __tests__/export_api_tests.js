// export api tests
//

const ava = require('ava')
const config = require('../config')
const api = require('../api')

const _sampleData = require('./pkgs/sample_export_data.json')

var _api

ava.serial('initialize API', test => {
	test.truthy(config.api.path)
	test.truthy(config.api.secret)

	_api = new api()
	_api.secret = config.api.secret
	_api.apiPath = config.api.path

	test.true(_api instanceof Object, 'could not create api object')
	test.is(_api.secret, config.api.secret, 'unable to set secret')
	test.is(_api.apiPath, config.api.path, 'unable to set secret')
	test.not(_api.loadAllModules(), 0, 'could not load modules')
})

ava.test('test parsing export data', test => {
	var obj = _api.findModule('export', 1)
	test.truthy(obj, 'could not locate export api route')

	var req = { 
		body: _sampleData
	}
	var rsp = {
		send: function(msg) {
			console.log(msg)
		}
	}
	obj.method(req, rsp)
})