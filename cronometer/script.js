//1)Select time html
/**
   First we have to select the elements of UI 
   which will contain hours, minutes, seconds and centiseconds
*/
let getHours = document.querySelector('.hours');
let getMinutes = document.querySelector('.minutes');
let getSeconds = document.querySelector('.seconds');
let getCentiseconds = document.querySelector('.miliseconds');

//Select buttons
/**
	Secondly, we select the elements that will be the function controllers
*/
let startBtn = document.querySelector('.start-lap');
let stopBtn = document.querySelector('.stop-lap');
let resetBtn = document.querySelector('.reset-lap');
let freezBtn = document.querySelector('.freez-lap');




//At the end
//Autogenerated lap js
let autoGen = document.querySelector('.lap-overview');
let clearLap = document.querySelector('.clear-lap-buttons');
//Color Palet
let palet_1 = document.querySelector('.palet_1');
let palet_2 = document.querySelector('.palet_2');
let palet_3 = document.querySelector('.palet_3');
let palet_4 = document.querySelector('.palet_4');
let timerContainer = document.querySelector('.time-container');
let timeOverview = document.querySelector('.lap-overview');




//we create global values
//Main variables
let hours_time = 0;
let minutes_time = 0;
let seconds_time= 0;
let centiseconds_time = 0;

//3)Variable which will be used with set interval 
//which will be used to set the timer interval
let timer = '';

//At the end
let coutnLap = 0;

//Our chronometer object
/**
objects in javascript are the same as in other programming languages
an object has two components a key and a value but can also contain functions
*/
let cronos = {

	count(){
//----------------------------------Seconds---------------------------------------------------------------//
		if(centiseconds_time < 99){
			//autoincement value if this is less that 99
			centiseconds_time ++;
			//update first digit if the time is less  that 10
			centiseconds_time = ((centiseconds_time < 10) ? '0' : '') + centiseconds_time;
			//display that result to the UI
			getCentiseconds.innerHTML  = centiseconds_time;
		}


		if(centiseconds_time == 99){
			centiseconds_time = -1;
		}

     
		if(centiseconds_time == 0){
			//same as above
			seconds_time++;
			seconds_time = ((seconds_time < 10) ? '0' :'') + seconds_time;

			getSeconds.innerHTML  = seconds_time; 

		}
//----------------------------------Minutes---------------------------------------------------------------//

		if(seconds_time == 59){
			seconds_time = -1;
		}




		if((seconds_time == 0) && (centiseconds_time == 0)){
			minutes_time++;

			minutes_time = ((minutes_time < 10 ? '0' : '')) + minutes_time;

			getMinutes.innerHTML = minutes_time;
		}
//----------------------------------Hours---------------------------------------------------------------//
		if(minutes_time == 59){
			minutes_time = -1;
		}


		if ((centiseconds_time == 0) && (seconds_time == 0) && (minutes_time == 0)) {
			hours_time ++;
			hours_time = ((hours_time < 10) ? '0' : '') + hours_time;
			getHours.innerHTML = hours_time;
		}

	},
    //this =>is used in javascript to refer to the object name
	initialization(){
		timer = setInterval(this.count, 10);
	},

	stop(){
		let stop  = clearInterval(timer);
	},

	resetLap(){
        let stop  = clearInterval(timer);

		getHours.innerHTML = '00'; 
		hours_time = 0;
		
		getMinutes.innerHTML = '00';
		minutes_time = 0;

		getSeconds.innerHTML = '00';
		seconds_time= 0;

		getCentiseconds.innerHTML = '00'; 
 		centiseconds_time = 0;
	},


	freezing(){

		const markup  = `
			<div class="timejs-container">
				<span class="lap--autogenerated">Lap ${coutnLap++} -></span>
				<span class="timer-js">${getHours.textContent}</span>
				<span class="separators">:</span>
				<span class="timer-js">${getMinutes.textContent}</span>
				<span class="separators">:</span>
				<span class="timer-js">${getSeconds.textContent}</span>
				<span class="separators">:</span>
				<span class="timer-js">${getCentiseconds.textContent}</span>
			</div>
		`;
		autoGen.insertAdjacentHTML('afterbegin',markup);
	},

	clearLapFnc(){
		clearLap.style.display = 'none';
		const  insertedContent = document.querySelectorAll('.timejs-container').forEach((rev)=>{
			rev.parentNode.removeChild(rev);
			coutnLap = 0;
		}); 
	}
	

}

startBtn.onclick = () => {
	cronos.initialization();
	startBtn.disabled = true;
	freezBtn.disabled= false;

}
stopBtn.onclick = () => {
	cronos.stop();
	startBtn.disabled = false;

}

resetBtn.onclick = () =>{
	cronos.resetLap();
	startBtn.disabled = false;
	freezBtn.disabled= true;
	timerContainer.setAttribute('data-color','#2a9d8f');
	timeOverview.setAttribute('data-color','#2a9d8f');
	
}

freezBtn.onclick = () =>{
	cronos.freezing();
	clearLap.style.display = 'block';
	
}
clearLap.onclick = ()=>{
	cronos.clearLapFnc();
	timerContainer.setAttribute('data-color','#2a9d8f');
	timeOverview.setAttribute('data-color','#2a9d8f');
}


palet_1.onclick = ()=>{
	timerContainer.setAttribute('data-color','#2a9d8f');
	timeOverview.setAttribute('data-color','#2a9d8f');
	
}
palet_2.onclick = ()=>{
	timerContainer.setAttribute('data-color','#e9c46a');
	timeOverview.setAttribute('data-color','#e9c46a');
	
}
palet_3.onclick = ()=>{
	timerContainer.setAttribute('data-color','#f4a261');
	timeOverview.setAttribute('data-color','#f4a261');
	
}
palet_4.onclick = ()=>{
	timerContainer.setAttribute('data-color','#e76f51');
	timeOverview.setAttribute('data-color','#e76f51');
	
}