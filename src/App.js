import React from 'react';

import './App.css';
import Amount from 'arui-feather/amount';
import Form from 'arui-feather/form';
import FormField from 'arui-feather/form-field';
import Input from 'arui-feather/input';
import Button from 'arui-feather/button';
import CardInput from 'arui-feather/card-input';
import MoneyInput from 'arui-feather/money-input';
import Spin from 'arui-feather/spin';
 
 
const AMOUNT = {
	value: 123535,
	currency: {
		code: 'RUR',
		minority: 100
	}
};

//"красивый" эффект при перемещении мыши вам обеспечен!
window.onload = () => {
	var sde = document.querySelectorAll('.Card');
	document.onmousemove = (mouse => {
		sde.forEach(e => {
			var x = -(mouse.x - window.screen.width/2) / 83;
			var y = -(mouse.y - window.screen.height/2) / 83;
			e.style.boxShadow = x + "px " + y + "px 3px 3px #11111188";
		})
	})
}



class App extends React.Component  {
	constructor(props) {
		super(props);

		this.state = {
			/*состояние выплаты
			0 - ждем заполнения данных польователя
			1 - ждем обработки сообщения сервером
			2 - успешная выплата
			3 - ошибка выплаты
			*/
			progress: 0,
		};
	}
	makeQuery(f) {
		let out = {};
		out.num = f.target[0].value;
		out.mm = f.target[1].value;
		out.yy = f.target[2].value;
		out.fio = f.target[3].value;
		out.cvv = f.target[4].value;
		if (out.cvv.length !== 3 ||
			out.fio.length === 0 ||
			out.mm.length === 0 ||
			out.yy.length === 0 ||
			out.num.length === 0) {
			alert("Неверно введеные данные");
			return;
		}
		var object = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:3001/pay', true);
		xhr.send(JSON.stringify(out));
		object.setState({ progress: 1 })
		xhr.onreadystatechange = function () {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				// обработать ошибку
				alert('ошибка: ' + (this.status ? this.statusText : 'запрос не удался'));
				return;
			}
			let answer = JSON.parse(xhr.responseText);
			console.log(answer);
			if (answer.status == "success"){
				console.log(object)
				object.setState({ progress: 2 })
			}
				
		}
	}
	render(){
		 
		switch (this.state.progress){
			default:
				return (
					<div className="App">
						<header className="App-header">
							<Form onSubmit={(f) => { this.makeQuery(f) }}>
								<Amount size="l" amount={AMOUNT} isHeading={true} />
								< div className="Card" >
									<p><CardInput className="custom__input" value="1111 1111 1111 1111 11" size="l" label='Номер карты' /></p>
									<p>
										<Input value="11" placeholder="MM" className="Picker" placeholder="ММ" size="m" mask="11"></Input>
										<Input value="11" placeholder="YY" className="Picker" placeholder="ГГ" size="m" mask="11"></Input>
									</p>
									<p><Input className="custom__input" value="Попов Иван" placeholder='ФИО' size="m" ></Input></p>
								</div>
								< div className="Card" >
									<br></br>
									<hr className="Black-field"></hr>
									<Input className="CVV" label='CVV' size="l" value="111" mask="111"></Input>
								</div>
								<Button view='extra' type='submit'>Оплатить</Button>
							</Form>
						</header>
					</div>
				);
			break;
			case 1:
				return (
				<div className="App">
					<header className="App-header">
					<p><Spin size="xl" visible={true}/> Обработка выплаты..</p>
					</header>
				</div>
				)
			break;
			case 2:
				return (
					<div className="App">
						<header className="App-header">
							<p>Выплата успешна!</p>
						</header>
					</div>
				)
			break;
			case 3:
				return (
					<div className="App">
						<header className="App-header">
							<p>Выплата не прошла :C</p>
						</header>
					</div>
				)
				break;
		}
	}
}
export default App;
