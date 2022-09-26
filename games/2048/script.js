////// MOBILE GESTURES ////////

var myElement = document.getElementById('mobilewrap');
var hammertime = new Hammer(myElement);
hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

hammertime.on('swipeleft', function(ev) {
  moveDirection(37);
});

hammertime.on('swiperight', function(ev) {
  moveDirection(39);
});

hammertime.on('swipeup', function(ev) {
  moveDirection(38);
});

hammertime.on('swipedown', function(ev) {
  moveDirection(40);
});

/* ---------------------------------------------------------------------- */

var matrix = [[0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0]];
var component = new Array();
var best = 0;
var score = 0;

$(".button").on("click", function(){
  restoreField();
  init();
});

init();

function restoreField(){
  score = 0;
  $(".scorefield").text(score);
  matrix = [[0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]];
  component = new Array();
  $('.tiles').remove();
  $("#container").append("<div class='tiles'></div>");
  $(".over").css("visibility", "hidden").css("opacity", "0");
}

function random(min, max) {
  return Math.floor((Math.random() * max) + min);
}

function dueoquattro(){
  return (((Math.random() * 10) > 5) ? 4 : 2);
}

function init(){
  var i = 0;
  while(i < 2){
    var x = random(0, 4);
    var y = random(0, 4);
    
    if(matrix[x][y] == 0){
      i++;
      matrix[x][y] = dueoquattro();
      component.push({x: x, y: y});
      
      updateTile(12 * x, 12 * y, x, y);
    }
  }
}

function updateTile(trax, tray, x, y){
    $(".tiles").append("<div class='tile tile-" + matrix[x][y] + " tile-" + x + "-" + y + "' style='transform: translate(" + trax + "vh, " + tray + "vh);'><div class='tile_content'><span>" + matrix[x][y] + "</span></div></div>");
}

window.addEventListener('keydown',this.direction,false);

function compare(a,b) {
  if(dx == 1){
    if (a.x < b.x)
      return -1;
    if (a.x > b.x)
      return 1;
    return 0;
  }
}

function moveDirection(code){
  var change = 0;
  switch(code){
    case 37: 
      component.sort(function(a, b){if(a.x < b.x){return -1;}if(a.x > b.x){return 1;}return 0;}); 
      change = move(-1,0);
      break;
    case 38:
      component.sort(function(a, b){if(a.y < b.y){return -1;}if(a.y > b.y){return 1;}return 0;}); 
      change = move(0,-1);
      break;
    case 39:
      component.sort(function(a, b){if(a.x > b.x){return -1;}if(a.x < b.x){return 1;}return 0;}); 
      change = move(1,0);
      break;
    case 40:
      component.sort(function(a, b){if(a.y > b.y){return -1;}if(a.y < b.y){return 1;}return 0;}); 
      change = move(0, 1);
      break;
  }

    if(change > 0){
      addTile();
    }
  
    if(checkDefeat()){
      $(".over").css("visibility", "visible").css("opacity", "1");
    }

}

function checkDefeat(){
  if(component.length == 16){
    for(var i = 0; i < component.length; i++){
      for(var x = -1; x <= 1; x++){
        for(var y = -1; y <= 1; y++){
          if(x != y && Math.abs(x) != Math.abs(y)){
            if(isMovePossible(component[i].x, component[i].y, x, y, i)){
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}

function won(){
  $(".won").css("visibility", "visible").css("padding-top", "0px").css("opacity", 1);
}

function direction(e) {
  moveDirection(e.keyCode);
}

function addTile(){
  var i = 0;
  while(i < 1){
    var x = random(0, 4);
    var y = random(0, 4);
    
    if(matrix[x][y] == 0){
      i++;
      matrix[x][y] = dueoquattro();
      component.push({x: x, y: y});
      
      updateTile(12 * x, 12 * y, x, y);
    }
  }
}

function move(dx, dy){
  var change = 0;  
  for(var i = 0; i < component.length; i++){
      while(isMovePossible(component[i].x, component[i].y, dx, dy, i)){
        makeMove(component[i].x, component[i].y, dx, dy, i);
        change++;
        if(component[i].x != -1 && component[i].y != -1){
          component[i].x +=  dx;
          component[i].y +=  dy;
        }
      }
  }
  
  checkTrash();
  return change;
}

function makeMove(x, y, dx, dy, i){
  var newX = x + dx;
  var newY = y + dy;  
  var newValue = matrix[x][y] + matrix[newX][newY];
    
  if(matrix[newX][newY] == matrix[x][y]){
    component[i].x = -1;
    component[i].y = -1;
    score += newValue;
    $(".scorefield").text(score);
    if(score > best){
      best = score;
      $(".numbest").text(best);
    }
  }
  
  matrix[newX][newY] = newValue;
  matrix[x][y] = 0;
  
  updateTile(12 * newX, 12 * newY, newX, newY);
  $('.tile-' + x + '-' + y + '').remove();
  
  if(newValue == 2048){
    won();
  }
}

function checkTrash(){
  for(var i = 0; i < component.length; i++){
    if(component[i].x == -1 && component[i].y == -1){
      component.splice(i, 1);
    }
  }
}

function isMovePossible(x, y, dx, dy, i){
  var newX = x + dx;
  var newY = y + dy;
  
  if(newX < 4 && newX >= 0 && newY < 4 && newY >= 0){
    if(matrix[newX][newY] == 0){
      return true;
    }else if(matrix[newX][newY] == matrix[x][y]){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}