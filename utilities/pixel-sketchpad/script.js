var active = false;
var erase = false;
var pencil = true;
var highlight = false;
var shade = false;
tablegen();

function tablegen() {
  var viewportW = $(window).width();
  var viewportH = $(window).height();
  var widthnumber = 100;
  if ($('#gridsizetgl').is(':checked')) {
    widthnumber = 50;
  };
  var ratio = viewportH / viewportW;
  var content = "<table id='canvas'>"
  i = 0;
  d = 0;
  for (i = 0; i < (ratio * widthnumber); i++) {
    content += "<tr>"
    for (d = 0; d < (widthnumber); d++) {
      content += "<td class='pixel'>"
    };
    content += "</tr>"
  }
  content += "</table>"
  $('#canvas').replaceWith(content);
  if ($('#gridtgl').is(':checked')) {
    $('.pixel').addClass('grid');
  };
  if ($('#gridsizetgl').is(':checked')) {
    $('.pixel').addClass('lg');
  };
  $("#canvas").selectable({
    stop: function() {
      $("td.ui-selected").each(function() {
        $(this).removeClass("grass floor wall object red brown black")
        $(this).addClass($activeClass);
        $(this).removeClass("button active ui-selected")
      });
    }
  });
  if (pencil) {
    $("#canvas").selectable("option", "disabled", true);
  };
};

$('.generate').click(function() {
  $(".popup-gen").removeClass("open")
  $(".content").removeClass("fade")
  tablegen();
});

$('#gridtgl').change(function() {
  $('.pixel').toggleClass('grid');
});

$(".toolbar").draggable({
  containment: "parent"
});

$(window).resize(function() {
  var divWidth = $('.pixel').width();
  $('.pixel').height(divWidth);
});

var $activeClass;

$('.button').click(function() {
  $('.button').not($(this)).removeClass('active');
  $(this).addClass('active');
  $activeClass = '';
  $activeClass = $(this).attr("class");
  $('.highlight').removeClass('on');
  $('.shade').removeClass('on');
  highlight = false;
  shade = false;
});

$('.toggle').click(function() {
  if ($(this).hasClass('pencil')) {
    if (pencil) {
      $(this).removeClass('on');
      pencil = false;
      $("#canvas").selectable("option", "disabled", false);
    } else {
      $(this).addClass('on');
      pencil = true;
      $("#canvas").selectable("option", "disabled", true);
    };
  };
  if ($(this).hasClass('highlight')) {
   if (highlight) {
      $(this).removeClass('on');
      highlight = false;
      shade = false;
    } else {
      $(this).addClass('on');
      $('.shade').removeClass('on');
      highlight = true;
      shade = false;
      $('.button').removeClass('active');
    };
  };
  if ($(this).hasClass('shade')) {
   if (shade) {
      $(this).removeClass('on');
      shade = false;
      highlight = false;
    } else {
      $(this).addClass('on');
      $('.highlight').removeClass('on');
      shade = true;
      highlight = false;
      $('.button').removeClass('active');
    };
  };
});

$(".popup-clear .confirm").click(function() {
  $("td").removeClass("shaded highlighted button active grass floor wall object red brown black")
  $(".popup-clear").removeClass("open")
  $(".content").removeClass("fade")
});

$(".popup-clear .cancel").click(function() {
  $(".popup-clear").removeClass("open")
  $(".content").removeClass("fade")
});

$(".clear").click(function() {
  $(".popup-clear").addClass("open")
  $(".content").addClass("fade")
});

$(".gen").click(function() {
  $(".popup-gen").addClass("open")
  $(".content").addClass("fade")
});

$(".popup-gen .cancel").click(function() {
  $(".popup-gen").removeClass("open")
  $(".content").removeClass("fade")
});

$(".help").click(function() {
  $(".popup-help").addClass("open")
  $(".content").addClass("fade")
});

$(".popup-help .confirm").click(function() {
  $(".popup-help").removeClass("open")
  $(".content").removeClass("fade")
});

$('.content').on("mousedown", "td", function(ev) {
  switch (event.which) {
    case 1:
      if (pencil) {
        if (highlight) {
          active = true;
          erase = false;
          $(this).removeClass('shaded');
          $(this).addClass('highlighted');
        } else if (shade) {
          active = true;
          erase = false;
          $(this).removeClass('highlighted');
          $(this).addClass('shaded');
        } else {
          active = true;
          erase = false;
          ev.preventDefault();
          $(this).removeClass("highlighted shaded grass floor wall object red brown black")
          $(this).addClass($activeClass);
          $(this).removeClass("button active")
        };
      };
      break;
    case 2:
      break;
    case 3:
      if (pencil) {
        active = false;
        erase = true;
        ev.preventDefault();
        $(this).removeClass("button active");
        if (highlight) {
          $(this).removeClass('highlighted');
        } else if (shade) {
          $(this).removeClass('shaded');
        } else {
          $(this).removeClass("shaded highlighted grass floor wall object red brown black")
        };
      };
  };
});

$('.content').on("mouseenter", "td", function(ev) {
  if (pencil) {
    if (highlight) {
      if (active) {
        $(this).removeClass('shaded');
        $(this).addClass('highlighted');
      };
      if (erase) {
        $(this).removeClass('highlighted');
      };
    } else if (shade) {
      if (active) {
        $(this).removeClass('highlighted');
        $(this).addClass('shaded');
      };
      if (erase) {
        $(this).removeClass('shaded');
      };
    } else { 
      if (active) {
        $(this).removeClass("highlighted shaded grass floor wall object red brown black")
        $(this).addClass($activeClass);
        $(this).removeClass("button active")
      };
      if (erase) {
        $(this).removeClass("highlighted shaded grass floor wall object red brown black")
        $(this).removeClass("button active")
      };
    };
  };
});

$('.content').on("mouseup", "td", function(ev) {
  if (pencil) {
    active = false;
    erase = false;
  };
});