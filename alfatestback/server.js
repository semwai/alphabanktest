const server = require('express')({})

server.get('/pay', (req, res) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.append('Access-Control-Allow-Headers', 'Content-Type');
	let answer = {}
	answer.status = "success"
	//представим, что сервер долго обрабатывает запрос - обращается к бд, что-то умное делает и тд.
	setTimeout(()=>{
		res.send(JSON.stringify(answer));
		res.status(200).end()
	},5000);

	
	console.log(req.body);
});
server.listen(3001);