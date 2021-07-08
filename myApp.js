var bodyParser = require("body-parser");
var express = require('express');

var port = 3001;
var app = express();

// expose "/public" directory to root path
app.use("/public", express.static(__dirname + "/public"))

// add a middleware function to every request
app.use((req, res, next) => {
	const method = req.method;
	const path = req.path;
	const ip = req.ip;

	let string = `${method} ${path} - ${ip} `

	console.log(string)

	next()
});

// BODY PARSER middleware
app.use(bodyParser.urlencoded({extended: false}))

// send "index.html" when there is a request on root path
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"))

// JSON route handle
app.get("/json", (req, res) => {
	let response = { "message": "Hello json" };

	if (process.env['MESSAGE_STYLE'] === "uppercase") {
		response.message = response.message.toUpperCase();
	}

	res.json(response);
})

// NOW route handle
app.get("/now", (req, res, next) => {
	req.time = new Date().toString()
	next()
}, (req, res) => {
	let response = { time: req.time}
	res.send(response)
})

// ECHO route handle
app.get("/:word/echo", (req, res) => {
	let word = req.params.word;
	let response = {echo: word};

	res.send(response);
})

// NAME route handle (GET and POST)
app.route("/name")
	.get( (req, res) => {
		const first = req.query['first'];
		const last = req.query['last'];

		const response = {name: `${first} ${last}`}

		res.send(response)
	})
	.post( (req, res) => {
		const first = req.body['first'];
		const last = req.body['last'];

		const response = {name: `${first} ${last}`}

		res.send(response)
	})

app.listen(port)

































module.exports = app;
