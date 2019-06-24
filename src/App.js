import React from 'react';

import './App.css';
import Form from 'arui-feather/form';
import Input from 'arui-feather/input';
import Button from 'arui-feather/button';
import CardInput from 'arui-feather/card-input';
import MoneyInput from 'arui-feather/money-input';
import Spin from 'arui-feather/spin';
import Notification from 'arui-feather/notification';
import Select from 'arui-feather/select';
import Icon from 'arui-feather/icon';

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

//массивы для полей ввода месяца и года окончания работы карты
const MM = [
    { value: '1', text: 'Январь' },
    { value: '2', text: 'Февраль' },
	{ value: '3', text: 'Март' },
	{ value: '4', text: 'Апрель' },
	{ value: '5', text: 'Май' },
	{ value: '6', text: 'Июнь' },
	{ value: '7', text: 'Июль' },
	{ value: '8', text: 'Август' },
	{ value: '9', text: 'Сентябрь' },
	{ value: '10', text: 'Октябрь' },
	{ value: '11', text: 'Ноябрь' },
	{ value: '12', text: 'Декабрь' },
];
const YY = [
    { value: '19', text: '2019' },
    { value: '20', text: '2020' },
	{ value: '21', text: '2021' },
	{ value: '22', text: '2022' },
	{ value: '23', text: '2023' },
];
class App extends React.Component  {
	
	constructor(props) {
		super(props);
		this.cardNum = ""
		this.state = {
			/*состояние выплаты
			0 - ждем заполнения данных польователя
			1 - ждем обработки сообщения сервером
			2 - конечное сообщение
			*/
			progress: 0,
			message:"",
			//флаги корректного ввода
			CVVflag:false,
			nameValidateFlag:false,
			cardValidateFlag:false,
			moneyValidateFlag:false
		};
	}
	makeQuery(f) {
		let out = {};
		console.log(this.refs)
		out.summ =  this.refs.cardSumm.state.value.replace(/ /g,'')
		out.num = this.cardNum.replace(/ /g,'')
		out.mm = this.refs.cardMM.state.value[0];
		out.yy = this.refs.cardYY.state.value[0];
		out.fio = this.refs.cardName.state.value;
		out.cvv = this.refs.cardCVV.state.value;
		var object = this;
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `http://localhost:3002/${out.summ}/${out.fio}/${out.num}/${out.mm}/${out.yy}/${out.cvv}/`, true);
		console.log(out);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send();
		
		object.setState({ progress: 1 })
		
		xhr.onreadystatechange = function () {
			if (this.readyState != 4) return;
			if (this.status != 200) {
				// обработать ошибку
				object.setState({ progress: 2,message: "Сервер не отвечает 😥" })
				return;
			}
			try{
				let answer = JSON.parse(xhr.responseText);
				console.log(answer);
				if (answer.status == "success"){
					object.setState({ progress: 2,message: "Выплата прошла успешно!" })
				} else{
					object.setState({ progress: 2,message: answer.error })
				}
			}
			catch (ex){
				object.setState({ progress: 2,message: "Ошибка работы сервера 😥" })
			}
			
				
		}
	}
	validateCVV(value){
		this.setState({CVVflag:value.length==3})
	}
	validateMoney(value){
		this.setState({ moneyValidateFlag:parseInt(value)>0})
	}
	validateCard(value){
		this.setState({cardValidateFlag:value.length>=16})
		this.cardNum = value;
	}
	validateName(value){
		var flag = value.length>0;
		value.split('').forEach(e=>{
			if (e==' ')
				{}
			else
				if (e<'A'||e>'Z')
					flag = false;
		});
		this.setState({nameValidateFlag:flag})
	}
	resetValidateFlags(){
		this.setState({CVVflag:false,
			nameValidateFlag:false,
			cardValidateFlag:false,
			moneyValidateFlag:false})
	}
	render(){
		switch (this.state.progress){
			default:
				return (
					<div className="App">
						<header className="App-header">
							<Form onSubmit={(f) => { this.makeQuery(f) }}>
							Сумма:<MoneyInput
								showCurrency={ true }
								currencyCode='RUR' 
								bold={ true } 
								ref="cardSumm"
								size="xl"
								defaultValue="1,0"
								onChange={(f)=>{this.validateMoney(f)}}
								error={!this.state.moneyValidateFlag} 
							/>
								< div className="Card" >
									<p>
									<CardInput className="custom__input"  size="l" label='Номер карты' 
									onChange={(f)=>{this.validateCard(f)}}
									error={!this.state.cardValidateFlag}/></p>
									<p>
									<Select className="Picker" size="m" mode='radio' options={ MM } ref="cardMM"/>
									<Select className="Picker" size="m" mode='radio' options={ YY } ref="cardYY"/>
									</p>
									<p><Input className="custom__input" placeholder='ФИО' size="m" 
									error={!this.state.nameValidateFlag} 
									ref="cardName"
									onChange={(f)=>{this.validateName(f)}}
									rightAddons={this.state.nameValidateFlag?"":"Большие латинские буквы"}></Input></p>
								</div>
								< div className="Card" >
									<br></br>
									<hr className="Black-field"></hr>
									<Input className="CVV" label='CVV' 
									ref="cardCVV"
									onChange={(f)=>{this.validateCVV(f)}} size="l" mask="111"
									error={!this.state.CVVflag} ></Input>
								</div>
								<Button view='extra' type='submit' 
								 disabled={!(this.state.CVVflag&&this.state.nameValidateFlag&&this.state.cardValidateFlag&&this.state.moneyValidateFlag) }
								 >Оплатить</Button>
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
							<p>{this.state.message}</p>
							<Button onClick={()=>{this.setState({progress:0});this.resetValidateFlags()}} >Назад</Button>
						</header>
						
					</div>
				)
			break;
		}
	}
}
export default App;
