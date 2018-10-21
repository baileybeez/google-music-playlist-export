// app

const express = require('express')
const config = require('./config')

const app = express()
app.use(express.json())

app.get('/', (request, response) => {
	response.status(403).end()
})

app.post('/api/v1/export/', (request, response) => {
	
})

app.listen(config.node.port, () => {
	console.log(`listening on port ${config.node.port} ... `)
})