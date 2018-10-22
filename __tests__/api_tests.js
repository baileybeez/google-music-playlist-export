// api_tests

const ava = require('ava')
const fs = require('fs')
const path = require('path')
const config = require('../config.js')
const api = require('../api.js')

const TEST_MODULE = 'test_api_v1.js'

var _api
var _testModulePath
var _moduleCount

ava.serial('config has necessary settings', test => {
	test.truthy(config.api.path)
	test.truthy(config.api.secret)
})

ava.serial('initialize API', test => {
	_api = new api()
	test.true(_api instanceof Object, 'could not create api object')
})

ava.serial('configure api secret', test => {
	_api.secret = config.api.secret
	test.is(_api.secret, config.api.secret, 'unable to set secret')
})

ava.serial('configure api path', test => {
	_api.apiPath = config.api.path
	test.is(_api.apiPath, config.api.path, 'unable to set secret')
})

ava.serial('locate testing module', test => {
	test.plan(4)

	return new Promise((resolve, reject) => {
		fs.readdir(_api.apiPath, (err, files) => {
			if (err) test.fail(err)
			test.true(Array.isArray(files), 'failed to fetch module list')
		
			var set = files.filter(file => file.indexOf(TEST_MODULE) != -1)
			test.not(set.count, 0, 'test module not found in file list')
			_testModulePath = path.resolve(process.cwd(), config.api.path, set[0])
			
			test.truthy(_testModulePath, 'test module path not found')
			test.true(_testModulePath.length > 0, 'invalid test module path')
			resolve()
		})
	})
})

ava.serial('load a test module', test => {
	var obj = _api.loadModule(_testModulePath)

	test.truthy(obj, 'unable to load test module')
	test.true(obj.version > 0, 'invalid version number')
	test.true(obj.url.length > 0, 'invalid api url')
	test.true(obj.method instanceof Function, 'invalid method')
	test.true(_api.isValidApi(obj), 'API cannot see a valid module')

	var testKey = 'test_1' //`${obj.url}_${obj.version}`
	test.is(testKey, _api.getKey(obj), 'cannot calculate correct key')

	var testUrl = '/api/v1/test/' // `/api/v${obj.version}/${obj.url}/`
	test.is(testUrl, _api.getRouteUrl(obj), 'cannot calculate correct route')
})

ava.serial('load all modules', test => {
	test.plan(3)

	return new Promise((resolve, reject) => {
		fs.readdir(_api.apiPath, (err, files) => {
			if (err) test.fail(err)
			test.true(Array.isArray(files), 'no modules found in dir')
			test.true(files.length > 0, 'no modules to load/test')

			_moduleCount = _api.loadAllModules()
			test.is(_moduleCount, files.length, 'some modules count not be loaded')

			resolve()
		})	
	})
})

ava.serial('modules loaded successfully :: manual map scan for key', test => {
	test.plan(_moduleCount * 2)

	var targetKey = _api.getKeyRaw('test', 1)
	Object.keys(_api._apiMap).forEach(key => {
		test.not(key, undefined, 'invalid key in map')
		test.not(key.length, 0, 'invalid key in map')

		console.log(`scan/keycheck -> ${key} ?= ${targetKey}`)
		if (targetKey == key)
			console.log("found target module: " + targetKey)
	})
})

ava.serial('locate requested module via api', test => {
	var obj = _api.findModule('test', 1)

	test.truthy(obj, 'module could not be found')
	test.is(obj.version, 1, 'invalid version number for module')
	test.is(obj.url, 'test', 'invalid url for module')
	test.truthy(obj.method, 'invalid method in module')
})