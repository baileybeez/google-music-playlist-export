// app

const express = require('express')
const config = require('./config')
const libApi = require('./api')

const app = express()

const api = new libApi()
api.secret = config.api.secret
api.apiPath = config.api.path

// setup cors
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', 'https://play.google.com')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	if (req.method == 'OPTIONS') {
		res.status(200)
		res.end()
	} else {
		next()
	}
})
app.use(express.json())

// setup base GET
app.get('*', (request, response) => {
	response.status(403).end()
})

// setup routes for REST api
api.loadAllModules()
api.initializeRoutes(app)

// begin listening
app.listen(config.node.port, () => {
	console.log(`listening on port ${config.node.port} ... `)
})