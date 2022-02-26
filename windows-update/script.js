//init percentage
let percentage = 0;
//init the current time
let currentTime;
//time of windows update in ms (default 5 min)
let time = 500000;
//refresh interval of the percentage in ms (default 1 seconde)
let refresh = 1000;

//on windows load
window.onload = function(){ 
    //get the begin current time
    currentTime = time;    
    //start the loading
    loading();
}

//infinite loop while the counter is not at zero
function loading(){
    //calucl the percentage time
    currentTime = currentTime - refresh;
    percentage = ((time-currentTime)*100)/time;
    
    //display the percentage
    document.querySelector('#update__percentage').innerHTML = parseInt(percentage)+'% complete';
    
    //is the time isn't finish reload the function
    if(currentTime != 0){
        setTimeout(loading,refresh);
    }
}