var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/:amount/:fio/:card/:mm/:yy/:cvv', (req, res) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	//res.append('Access-Control-Allow-Headers', 'Content-Type');
	let answer = {}
	answer.status = "success"
	//всякие проверки на существование карты и тд...
	try{
		if (parseFloat(req.params.amount.replace(" ","").replace(',','.')) > 1000){
			answer.status = "error"
			answer.error = "Недостаточно денег"
		}
	}
	catch (ex){
		answer.status = "error"
		answer.error = "Ошибочный ввод"
	}
	
	let userData = {};
	console.log(req.params);
	//представим, что сервер долго обрабатывает запрос - обращается к бд, что-то умное делает и тд.
	setTimeout(()=>{
		res.send(JSON.stringify(answer));
		res.status(200).end()
	},2500);
});
app.listen(3002);


