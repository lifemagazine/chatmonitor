
var router = function (app) {
	app.post("/chatbot", function(req, res) {
		var query = req.body.query;
		console.log('query => ' + query);
		var answer = chatbot(query);
		console.log('answer => ' + answer);
		res.status(200).send(answer);
	});
}

function chatbot(query) {
	var result = "";
	if (query == null)
		result = 'Hello, nice to meet you.';
	else {
		var arrayOfStrings = query.split(' ');
		result = 'Hello ' + arrayOfStrings[0] + ', nice to meet you.';
	}
	var data = { ok: 'true', value: result};
	return JSON.stringify(data);
}

module.exports = router;
