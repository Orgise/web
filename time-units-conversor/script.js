function GetNumber1(form) {
	var sNumber = parseFloat(stripBad(form.txtNumber.value));
	var cNum2 = parseFloat(form.txtNumbe3.value);
	sNumber = sNumber*cNum2;
	sNumber = gesult(sNumber);
	form.txtResult.value= sNumber}

function GetNumber1b(form) {	
	var sNumber = parseFloat(stripBad(form.txtNumber.value));
	var cNum2 = parseFloat(form.txtNumbe3.value)
	sNumber = sNumber/cNum2
	sNumber = gesult(sNumber)
	form.txtResult.value= sNumber}

function GetNumber2(form) {
	var h1 = parseFloat(stripBad(form.hour1.value));
	if (isNaN(h1)) h1 = 0;
	var m1 = parseFloat(stripBad(form.min1.value));
	if (isNaN(m1)) m1 = 0;
	var s1 = parseFloat(stripBad(form.sec1.value));
	if (isNaN(s1)) s1 = 0;
	var sNumber = (3600*h1) + (60*m1) + s1;
	sNumber = gesult(sNumber)
	form.txtResult.value= sNumber}

function GetNumber2h(form) {
	var h1 = parseFloat(stripBad(form.hour1.value));
	if (isNaN(h1)) h1 = 0;
	var m1 = parseFloat(stripBad(form.min1.value));
	if (isNaN(m1)) m1 = 0;
	var sNumber = (60*h1) + m1;
	sNumber = gesult(sNumber)
	form.txtResult.value= sNumber}

function GetNumber3dh(form) {
	var d1 = parseFloat(stripBad(form.day1.value));
	if (isNaN(d1)) d1 = 0;
	var h1 = parseFloat(stripBad(form.hour1.value));
	if (isNaN(h1)) h1 = 0;
	var m1 = parseFloat(stripBad(form.min1.value));
	if (isNaN(m1)) m1 = 0;
	var sNumber = (1440*d1) + (60*h1) + m1;
	sNumber = gesult(sNumber)
	form.txtResult.value= sNumber}

function GetNumber2dm(form) {
	var m1 = parseFloat(stripBad(form.min1.value));
	if (isNaN(m1)) m1 = 0;
	var t3 = m1;
	var t4= Math.floor(t3/1440);
	var t5= t3-(t4*1440);
	var t6= Math.floor(t5/60);
	var t7= t5-(t6*60);
   form.txtResult.value = "  " + t4  + "  days  " +  t6 + "  hours  " + t7 + "  minutes"}


function GetNumber2b(form) {
	var s1 = parseFloat(stripBad(form.sec1.value));
	if (isNaN(s1)) s1 = 0;
	var t3 = s1;
	var t4= Math.floor(t3/3600);
	var t5= t3-(t4*3600);
	var t6= Math.floor(t5/60);
	var t7= t5-(t6*60);
   form.txtResult.value = "  " + t4  + "  hours  " + "  " + t6 + "  minutes  " + t7 + "  seconds"}


function stripBad(string) {
    for (var i=0, output='', valid="eE-0123456789."; i<string.length; i++)
       if (valid.indexOf(string.charAt(i)) != -1)
          output += string.charAt(i)
    return output;
} 

function gesult(ff){

 if (Number.prototype.toFixed) {
   ff = ff.toFixed(2);
   ff = parseFloat(ff);
 }
 else {
   var leftSide = Math.floor(ff);
   var rightSide = ff - leftSide;
   ff = leftSide + Math.round(rightSide *1e+14)/1e+14;
 }

 return comma(ff);
}

function comma(num) {
 var n = Math.floor(num);
 var myNum = num + "";
 var myDec = ""
 
 if (myNum.indexOf('.',0) > -1){
  myDec = myNum.substring(myNum.indexOf('.',0),myNum.length);
 }

  var arr=new Array('0'), i=0; 
  while (n>0) 
    {arr[i]=''+n%1000; n=Math.floor(n/1000); i++;}
  arr=arr.reverse();
  for (var i in arr) if (i>0)
    while (arr[i].length<3) arr[i]='0'+arr[i];
  return arr.join() + myDec;
}

function ChangeURL(form) {
    var strURL = "";
    /* Grab the selected URL */
   strURL = form.wwwLocations.options[form.wwwLocations.selectedIndex].value;
    /* Is it blank? */
    if (strURL != "") {
    /* No, Navigate to the new URL */
    window.location.href = strURL;
    }
    }