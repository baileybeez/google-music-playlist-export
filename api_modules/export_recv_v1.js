// Google Music Export Receiver
// v1
//
// api/v1/export/

const fs = require('fs')
const api = {
	version: 1,
	url: 'export',
	method: null
}

api.method = (request, response) => {
	function isValid(json) {
		return Array.isArray(json) && 
			   json[0] instanceof Object && 
			   json[0].hasOwnProperty('playlist') && 
			   json[0].hasOwnProperty('tracks') && 
			   Array.isArray(json[0].tracks)
	}

	const json = request.body
	if (!isValid(json)) {
		response.send('error code 1: invalid json')
	} else {
		fs.writeFile('/tmp/test.json', JSON.stringify(json), (err) => {
			if (err) {
				response.send('error code 2: ' + err)
			} else {
				response.send('OK')
			}
		})
	}
}

module.exports = api;