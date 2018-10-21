// app

const express = require('express')
const config = require('./config')
const libApi = require('./api')

const app = express()
app.use(express.json())

const api = new libApi()
api.secret = config.api.secret
api.apiPath = config.api.path

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