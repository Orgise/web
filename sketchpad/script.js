var cv = document.getElementById('paper');
var ctx = null;
var x,y = 0;
var currColour = $('#colour').val();
//this is for vertical spacing of horizontal lines on 'paper'
var lineSpacing = 30;
		
$('#colour').on('change', function() {
	//THIS LINE IS NECESSARY -> provides dynamic colour-changing for stroke
	currColour = this.value;
	ctx.strokeStyle = currColour;	//stroke colour is chosen by user
});
		
if(cv && cv.getContext) {
	ctx = cv.getContext("2d");
	//colour of the 'paper'
	ctx.fillStyle = "#FFFFFF";
	//size of the 'paper'
	ctx.fillRect(0,0,960,500);
	
	//create red vertical line
	ctx.beginPath();
    ctx.moveTo(40, 0.5);
    ctx.lineTo(40, 500);
    ctx.lineWidth = 1;

    //set line color - red vertical line
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
	
	for(var i=1; i <= 16; i++) {
		//create blue horizontal lines
		ctx.beginPath();
		ctx.moveTo(0.5, lineSpacing * i);
		ctx.lineTo(960, lineSpacing * i);
		ctx.lineWidth = 1;
      
		// set line color - blue horizontal lines
		ctx.strokeStyle = '#0000ff';
		ctx.stroke();
		//THIS LINE IS NECESSARY -> resets current stroke colour to be user-defined once canvas is ready
		ctx.strokeStyle = currColour;
	}
}
else {
	alert("Your browser does not support the HTML5 Canvas");	
}

//'pencil' details
ctx.lineWidth = 3.0;
ctx.lineCap = "round";
ctx.lineJoin = "round";
	
function onStroke(e) {
	if(ctx) {
		ctx.beginPath();
		//move to x and y coordinates where mouse was pressed
		ctx.moveTo(x,y);
		//get current x and y coordinates from mouse event
		x = e.offsetX ? e.offsetX : (e.pageX - e.target.offsetLeft);
		y = e.offsetY ? e.offsetY : (e.pageY - e.target.offsetTop);
		//draw a line
		ctx.lineTo(x,y);
		//give a stroke/fill to our line
		ctx.stroke();
		//close the path/'stop drawing'
		ctx.closePath();
	}
}
	
function stopStroke(e) {
	//if mouse is not being pressed then don't draw anything
	cv.removeEventListener('mousemove',onStroke,false);
}
	
cv.onmousedown = function(e) {
	//if right sdie of mouse is clicked, don't proceed
	if(e.which == 3) return;
	//get x and y coordinates from where mouse is being pressed
	x = e.offsetX ? e.offsetX : (e.pageX - e.target.offsetLeft);
	y = e.offsetY ? e.offsetY : (e.pageY - e.target.offsetTop);
	//listen for mouse move and mouse up events
	cv.addEventListener('mousemove',onStroke,false);
	cv.addEventListener('mouseup',stopStroke,false);
}
	
//this function is for users to save their drawings as an image
function savePic() {
	window.location = cv.toDataURL('image/png');
}