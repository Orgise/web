/* VARIABLES */
/* sounds */
var s1 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s1.mp3');
var s2 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s2.mp3');
var s3 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s3.mp3');
var s4 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s4.mp3');
var s5 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s5.mp3');
var s6 = new Audio('https://josetxu.com/html5/guitar-tuner/audio/s6.mp3');

/* FUNCTIONS */
/* short getElementById */
function elem(id){
	var element = document.getElementById(id);
	return element;
}
/* tuner functions */
function pickString(thisString){
	if(pick == true) clickString(thisString);
}
function clickString(thisString) {
	elem('title').className='imgTitle';
	elem(thisString).className = "string";
	window[thisString].currentTime = 0;
	window[thisString].play();
	var thisNote = thisString+"Note";
	elem(thisString).className = "string playingSound";
	elem(thisNote).className = "lightOn";
	setTimeout(function(){ 		
		if(window[thisString].loop != true){
			elem(thisString).className = "string";
			elem(thisNote).className = "lightOff";
			if(document.querySelectorAll('.playingSound').length==0){
				elem('title').className='';
			}
		}
	}, 4500);
}
function holdSound(){
	if(s1.loop != true){
		s1.loop = s2.loop = s3.loop = s4.loop = s5.loop = s6.loop = true;
		elem('btnHold').className = "active";
	} else {
		s1.loop = s2.loop = s3.loop = s4.loop = s5.loop = s6.loop = false;
		elem('btnHold').className = "inactive";
		s1.pause(); s2.pause(); s3.pause(); s4.pause(); s5.pause(); s6.pause();	
		stopStrings();
	}
}
function stopStrings(){
	elem('title').className='';
	s1.pause(); s2.pause(); s3.pause(); s4.pause(); s5.pause(); s6.pause();
	var auxString = document.querySelectorAll('.playingSound');	
	for (var x in auxString) {
		if(auxString[x]!==undefined){
			auxString[x].className = "string";
		}
	}
	var auxNote = document.querySelectorAll(".lightOn");
	for (x in auxNote) {
		if(auxNote[x]!==undefined){
			auxNote[x].className = "lightOff";
		}
	}
}
function usePick(){
	var x = elem('btnPick').className;
	if(x == 'inactive'){
		elem('btnPick').className = 'active';
		pick = true;
		elem("guitarBody").className = 'pickActive';	
	} else {
		elem('btnPick').className = 'inactive';
		pick = false;
		elem("guitarBody").className = '';	
	}
}
/* ON LOAD */
(function() {
	setTimeout(function(){ 		
		clickString('s3');
	}, 500);
})();