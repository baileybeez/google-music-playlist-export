(function (title, artist, album, trackList) {
	function getPlayListTitle () {
		var o = document.querySelector('.title-row')
		if (o instanceof Object) {
			o = o.querySelector('h2[slot="title"]')
			if (o instanceof Object)
				return o.textContent
		}
		return "N/A"
	}

	function parse(item, col) {
		var o = item.querySelector(`td[data-col="${col}"] .column-content`)
		if (o instanceof Object)
			return o.textContent

		return ""
	}

	trackList = []
	document.querySelectorAll('.song-table .song-row')
			.forEach(item => {

		title = parse (item, 'title')
		artist = parse (item, 'artist')
		album = parse (item, 'album')

		trackList.push({
			'title': title,
			'artist': artist,
			'album': album
		})
	})

	if (window._beezList == undefined)
		window._beezList = []

	window._beezList.push({
		'playlist': getPlayListTitle(),
		'tracks': trackList
	})
})()

(function (url, xhr) {
	var xhr = new XMLHttpRequest()
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return
		if (this.status == 200) {
			console.log(this.responseText)
		}
	}
	xhr.open('POST', url, true)
	xhr.setRequestHeader('Content-Type', 'application/json')
	xhr.send(JSON.stringify(window._beezList))
})()