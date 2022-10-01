var prevCoords, currCoords, pivotCoords;
var bottleVector, swipeVector;
var angle = 0;
var isSwiping = false;
var bottle;

function init() {
  updatePivot();
  bottleVector = new Victor(200, 0); // set the initial state of the bottle
  render();
}

$(window).on('mousedown touchstart', function(e) {
  e.stopPropagation();
  e.preventDefault();

  isSwiping = true;

  prevCoords = getCoords(e);
  currCoords = getCoords(e);
});

$(window).on('mouseup touchend', function(e) {
  e.stopPropagation();
  e.preventDefault();

  isSwiping = false;

  // calculate force at the point the user releases the bottle, then spin
  var torque = swipeVector.clone().cross(bottleVector);
  var angle = {
    prev: 0,
    target: torque * 0.075
  }

  TweenLite.from(angle, 2, {
    target: 0,
    onUpdate: function() {
      var step = angle.target - angle.prev;
      bottleVector.rotateDeg(step);
      angle.prev = angle.target;
    },
    onComplete: function() {
      // Do stuff when bottle stops spinning
    }
  })
})

$(window).on('mousemove touchmove', function(e) {
  e.stopPropagation();
  e.preventDefault();

  if (!isSwiping) return;

  currCoords = getCoords(e);

  // Convert all our coordinates to vectors
  var currVector = new Victor(currCoords.x, currCoords.y);
  var prevVector = new Victor(prevCoords.x, prevCoords.y);
  var pivotVector = new Victor(pivotCoords.x, pivotCoords.y);
  swipeVector = currVector.clone().subtract(prevVector);

  // draw the vector of the bottle
  bottleVector = currVector.clone().subtract(pivotVector);
  bottleVector.norm().multiply(new Victor(200, 200)).invert();

  prevCoords = currCoords;
})

$(window).on('resize', function(e) {
  // update the pivot to the center of the screen
  updatePivot();
});

function render() {
  // Clear the display of any vectors
  $('body .vector').remove();

  if (swipeVector) renderVector(swipeVector, prevCoords);
  if (bottleVector) {
    renderVector(bottleVector, pivotCoords);
    rotate('#bottle', bottleVector.angleDeg() + 180);
  }

  // rotate bottle
  requestAnimationFrame(render);
}

function getCoords(e) {
  var coords = {};

  switch (e.type) {
    case 'mouseup':
    case 'mousedown':
    case 'mousemove':
      coords.x = e.pageX;
      coords.y = e.pageY;
      break;
    case 'touchstart':
    case 'touchmove':
      coords.x = e.originalEvent.touches[0].pageX;
      coords.y = e.originalEvent.touches[0].pageY;
      break;
  }

  return coords;
}

function renderVector(v, translate) {
  // This function makes it easy for us to draw vectors to the screen

  // Create a new vector div (essentially a line)
  var line = $('<div class="vector" />');

  // Set the position, angle and length of the line
  line.css({
    left: translate.x,
    top: translate.y,
    height: v.length()
  });
  rotate(line, v.angleDeg());

  $('body').append(line);

  return line;
}

function rotate(el, deg) {
  var angle = deg + 90;

  $(el).css({
    '-ms-transform': 'rotate(' + (angle) + 'deg)',
    '-webkit-transform': 'rotate(' + (angle) + 'deg)',
    'transform': 'rotate(' + (angle) + 'deg)'
  });
}

function updatePivot() {
  pivotCoords = {
    x: $(window).width() / 2,
    y: $(window).height() / 2
  };
  $('#pivot').css({
    left: pivotCoords.x,
    top: pivotCoords.y
  })
}

init();