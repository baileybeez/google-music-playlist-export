// api
//

const fs = require('fs')
const path = require('path')

const INVALID_API = {
	path: '', 
	version: 0,
	method: null
}

module.exports = class Api {
	constructor() {
		this._apiMap = { }
		this._path = null
		this._log = null
		this._secret = null
	}

	get secret() { return this._secret }
	set secret(value) { this._secret = value }

	get apiPath() { return this._path }
	set apiPath(value) { this._path = value }

	loadModule(file) {
		var obj = require(file)
		if (obj instanceof Object)
			return obj;
		
		return INVALID_API
	}

	loadAllModules() {
		var count = 0
		fs.readdirSync(this.apiPath).forEach(file => {
			var filePath = path.resolve(process.cwd(), this.apiPath, file)
			var obj = this.loadModule(filePath)
			if (this.isValidApi(obj)) {
				this.addApi(obj)
			}

			++count
		})

		return count
	}

	isValidApi(obj) {
		return (obj.version > 0 && 
				obj.method instanceof Function && 
				obj.url.length > 0)
	}

	getKey(obj) {
		return `${obj.url}_${obj.version}`
	}

	getRouteUrl(obj) {
		return `/api/v${obj.version}/${obj.url}/`
	}

	addApi(obj) {
		obj.key = this.getKey(obj)
		obj.routeUrl = this.getRouteUrl(obj)

		this._apiMap[obj.key] = obj
	}

	initializeRoutes(app) {
		Object.keys(this._apiMap).forEach(key => {
			var item = this._apiMap[key]

			console.log(`- adding route: ${item.routeUrl}`)
			app.post(item.routeUrl, (request, response) => {
				item.method(request, response)
			})
		})
	}
}