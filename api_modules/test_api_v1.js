// Test Api Call
// v1
//
// api/v1/test/

const api = {
	version: 1,
	url: 'test',
	method: null
}

api.method = (request, response) => {
	response.status(403).end()	
}

module.exports = api;