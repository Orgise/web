var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function Player(x,y){
	this.x=x;
	this.y=y;
	this.yVel=0;
	this.height = 24;
	this.width = 34; 
	this.grav=0.5;
}

function TopPillar(x,y,height){
	this.x=x;
	this.y=y;
	this.height=height;
	this.width=60;
	this.producedNew = false;
	this.gaveScorePoint = false;
}

function BotPillar(x,y,height){
	this.x=x;
	this.y=y;
	this.height=height;
	this.width=60;
}

var player = new Player(190,190);
var top_pil_min_height = 50;
var top_pil_height = Math.floor(Math.random()*200+top_pil_min_height);
var topPillars = [
	new TopPillar(canvas.width,0,top_pil_height)
];
var botPillars = [
	new BotPillar(canvas.width,top_pil_height+110,canvas.height)
];
var gameOver = false;
var displayGameOverOnce = true;
var score = 0;
var begin = false;
var pillarSpeed = 7;
var highscores = [];
var bgXoffset = 0;
var velocityIncrease = 8;
var wingsDownImage = new Image();
wingsDownImage.src = "flappy-jump.png";
var wingsUpImage = new Image();
wingsUpImage.src = "wings-up.png";
wingsStraightImage = new Image();
wingsStraightImage.src = "wings-straight.png";
clear();
displayTip();
start();

function start(){
	if(begin) update();
	requestAnimationFrame(start);
}

function update(){
	if(!(player.y+player.height > canvas.height)){
		player.yVel+=player.grav;
	} else if(player.yVel < 1){
		player.yVel = 0;
	}
	if(player.y+player.height > canvas.height) {
		player.y = canvas.height-player.height;
		gameOver = true;
	}
	if(player.y < 0){
		player.y = 0;
		gameOver = true;
	}
	checkPillarCollision();
	if(gameOver){
		if(displayGameOverOnce){
			displayGameOver();
			highscores.push(score);
			displayHighScores();
			displayGameOverOnce=false;
		}
		cancelAnimationFrame();
	}
	
	shiftPillars();
	clear();
	renderPlayer();
	renderTopPillars();
	renderBotPillars();
	displayScore();
	canvas.style.backgroundPosition=-bgXoffset + "px 0px";
	
	player.y+=player.yVel;
	bgXoffset+=2;
}

function displayHighScores(){
	c.save();
	c.fillStyle = "black";
	c.lineWidth = 1;
    c.font = "12pt Consolas";
    c.fillText("Highscores:", 435, 15);
    highscores.sort(function(a,b){return b-a});
    for(var i = 0; i < highscores.length; i++){
		c.fillText(i+1 + ": " + highscores[i], 435, 35+i*20);
    }
	c.restore();
}

function checkPillarCollision(){
	for(var i = 0; i < topPillars.length; i++){
		var top = topPillars[i];
		if(player.x+player.width > top.x && player.y < top.height && player.x < top.x+top.width){
			gameOver = true;
		}
		var bot = botPillars[i];
		if(player.x+player.width > bot.x && player.y+player.height > bot.y && player.x < bot.x+bot.width){
			gameOver = true;
		}
	}
}

function shiftPillars(){
	for(var i = 0; i < topPillars.length; i++){
		if(topPillars[i].x + topPillars[i].width < 0){ //out of bounds
			topPillars.splice(i,1);
			botPillars.splice(i,1);
		}
		topPillars[i].x-=pillarSpeed;
		botPillars[i].x-=pillarSpeed;
		if(topPillars[i].x < canvas.height && topPillars[i].producedNew == false){
			top_pil_height = Math.floor(Math.random()*200+top_pil_min_height);
			topPillars.push(new TopPillar(canvas.width,0,top_pil_height));
			botPillars.push(new BotPillar(canvas.width,top_pil_height+110,canvas.height))
			topPillars[i].producedNew = true;
		}
		if(topPillars[i].x +topPillars[i].width + 10 < player.x && topPillars[i].gaveScorePoint == false){
			score++;
			topPillars[i].gaveScorePoint=true;
		}
	}
}

document.onkeydown = function(e){
	if(!begin) {
		begin = true;
	} else {
		if(e.keyCode == 87){ //W
			player.yVel=-velocityIncrease;	
		}
		if(e.keyCode == 82 && gameOver){ //R
			player = new Player(190,190);
			score = 0;
			gameOver = false;
			displayGameOverOnce = true;
			top_pil_height = Math.floor(Math.random()*200+top_pil_min_height);
			topPillars = [
				new TopPillar(canvas.width,0,top_pil_height)
			];
			botPillars = [
				new BotPillar(canvas.width,top_pil_height+110,canvas.height)
			];
			start();
		}
	}
}

function displayTip(){
	c.save();
	c.fillStyle = "black";
	c.font = "12pt Consolas";
    c.fillText("W - to move up, avoid pillars", 1, 13);
	c.restore();
	renderPlayer();
}

function displayGameOver(){
	c.save();
	c.fillStyle = "black";
	c.strokeStyle = "black";
	c.lineWidth = 2;
	c.font = "32pt Consolas";
    c.strokeText("Game over!", 190, 200);
    c.fillText("Game over!", 190, 200);
    c.font = "12pt Consolas";
    c.fillText("Press R to restart", 220, 220);
	c.restore();
}

function displayScore(){
	c.save();
	c.fillStyle = "black";
	c.font = "12pt Consolas";
    c.fillText("Score: " + score , 1, 399);
	c.restore();
}

function renderTopPillars(){
	c.save();
	c.fillStyle = "forestgreen";
	for(var i = 0; i < topPillars.length; i++){
		c.fillRect(topPillars[i].x,topPillars[i].y,topPillars[i].width,topPillars[i].height);
	}
	c.restore();
}

function renderBotPillars(){
	c.save();
	c.fillStyle = "forestgreen";
	for(var i = 0; i < botPillars.length; i++){
		c.fillRect(botPillars[i].x,botPillars[i].y,botPillars[i].width,botPillars[i].height);
	}
	c.restore();
}

function renderPlayer(){
	c.save();
	c.fillStyle = "red";
	if(player.yVel <= 0){
		c.drawImage(wingsDownImage, player.x, player.y)
	} else if(Math.abs(player.yVel) <= 4){
		c.drawImage(wingsStraightImage, player.x, player.y)
	} else {
		c.drawImage(wingsUpImage, player.x, player.y)
	}
	c.restore();
}

function clear(){
	c.clearRect(0,0,canvas.width,canvas.height);
}