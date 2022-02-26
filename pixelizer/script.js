// Default dimensions
let defPixelWidth = 10;
let defSceneHeight = 200;
let defSceneWidth = 300;
sh = defSceneHeight;
sw = defSceneWidth;
pw = defPixelWidth;

// Set up the ui
function setUI() {
    $('.menu_options__psize .w').val(defPixelWidth);
    $('.menu_options__psize .h').val(defPixelWidth);
    $('.menu_options__ssize .w').val(defSceneWidth);
    $('.menu_options__ssize .h').val(defSceneHeight);
    $('button.s').data('size',`${defSceneWidth},${defSceneHeight}`);
    $('button.m').data('size',`${defSceneWidth * 1.5},${defSceneHeight * 1.5}`);
    $('button.l').data('size',`${defSceneWidth * 2},${defSceneHeight * 2}`);
    $('button.xl').data('size',`${defSceneWidth * 2.5},${defSceneHeight * 2.5}`);
}

setUI();

// Render the scene
function drawGrid(sw, sh, pw) {
    $('.scene .row, .scene .col').html('');
    $('.scene').width(sw);
    $('.scene').height(sh);

    for(i = 0; i < sw / pw; i++) {
        $('.scene .col').append(`<div class="scene_pixelcolumn" style="width:${pw}px; height:${sh}px"></div>`);
    }

    for(i = 0; i < sh / pw; i++) {
        $('.scene .row').append(`<div class="scene_pixelrow" style="width:${sw}px; height:${pw}px"></div>`);
    }
}

drawGrid(defSceneWidth, defSceneHeight, defPixelWidth);

// Fire the render scene when input is changed
$('.menu_options__psize input.w').change(() => {
    if($('.menu_options__psize input.w').val() == '') {
        $('.menu_options__psize input.w').val('1');
    }
    if($('.scene_pixel').length != 0) {
        const r = confirm("Changing this will delete your current progress!");
        if (r == true) {
            $('.scene_pixel').remove()
            pw = $('.menu_options__psize input.w').val();
            sw = $('.menu_options__ssize input.w').val();
            sh = $('.menu_options__ssize input.h').val();
            checkAspectRatio(sw, sh, pw);
        } 
    } else {
        pw = $('.menu_options__psize input.w').val();
        sw = $('.menu_options__ssize input.w').val();
        sh = $('.menu_options__ssize input.h').val();
        checkAspectRatio(sw, sh, pw);
    }
});

function changeSceneSize(button) {
    if($('.scene_pixel').length != 0) {
        const r = confirm("Changing this will delete your current progress!");
        if (r == true) {
            if($('.tools_grid').hasClass('inactive')){
                $('.tools_grid').click();
            }

            $('.scene_pixel').remove()
            pw = $('.menu_options__psize input.w').val();
            sw = button.data('size').split(',')[0];
            sh = button.data('size').split(',')[1];
            $('button').removeClass('active');
            button.addClass('active');
            drawGrid(sw, sh, pw);
        }
    } else { 
        if($('.tools_grid').hasClass('inactive')){
            $('.tools_grid').click();
        }
        pw = $('.menu_options__psize input.w').val();
        sw = button.data('size').split(',')[0];
        sh = button.data('size').split(',')[1];
        $('button').removeClass('active');
        button.addClass('active');
        drawGrid(sw, sh, pw);
    }
}

$('button.s, button.m, button.l, button.xl').click(function() {
    button = $(this);
    changeSceneSize(button);
});


// Let's work some magic on the scene size to keep things aspect ratio
function checkAspectRatio(sw, sh, pw) {

    let nearestW = Math.ceil(sw / pw) * pw;
    let nearestH = Math.ceil(sh / pw) * pw;

    $('.menu_options__ssize input.w').val(nearestW);
    $('.menu_options__ssize input.w').val(nearestW);
    $('.menu_options__ssize input.h').val(nearestH);

    sw = $('.menu_options__ssize input.w').val();
    sh = $('.menu_options__ssize input.h').val();

    $('button.s').data('size',`${sw},${sh}`);
    $('button.m').data('size',`${sw * 1.5},${sh * 1.5}`);
    $('button.l').data('size',`${sw * 2},${sh * 2}`);
    $('button.xl').data('size',`${sw * 2.5},${sh * 2.5}`);

    drawGrid(sw, sh, pw);
}

// Toggle reflect

reflection = false;
hasReflect = ''



$('input#reflect').change(function() {
    $('.scene').toggleClass('reflect');
    $(this).prev().toggleClass('active');
    updateForm()

    if(reflection == false) {
        reflection = true;
        hasReflect = '-webkit-box-reflect: below 10px -webkit-linear-gradient(top, rgba(255, 255, 255, 0) 76%, white 107%);\r\n'

    } else {
        reflection = false;
        hasReflect = ''
    }
    console.log(hasReflect)

});

// Toggle grid
let grid = true;

$('.tools_grid').click(function() {
    if(grid) {
        $('.scene_pixelrow, .scene_pixelcolumn').css('box-shadow', 'none');
        $('.scene').css('border', 'none');
        $(this).addClass('inactive')
        grid = false;
    } else {
        $('.scene').css('border', '1px solid #d0baef');
        $('.scene_pixelrow').css('box-shadow', '0px 1px rgba(255,255,255, 0.2) inset, 1px 0px rgba(255,255,255, 0.2) inset')
        $('.scene_pixelcolumn').css('box-shadow', '0px 1px rgba(255,255,255, 0.2) inset, 1px 0px rgba(255,255,255, 0.2) inset')
        grid = true;
        $(this).removeClass('inactive')
    }

})

let level = 1;
let scrollLevel = 10;

function zoom() {
    level = $('.tools_zoom input').val() / 10;
    scrollLevel = $('.tools_zoom input').val();

    $('.tip').html(`x ${level}`);
    $('.tip').css('left', `${level * 102 - 110}px`);
    $('.tip').css('opacity', 1);
    $('.zoom').css('transform',`scale(${level})`);
}

// Let's get the zoom working
$('.tools_zoom input').on("input change", () => {
    zoom();
})

$('.tools_zoom input').on("change", () => {
    setTimeout(() => {
        $('.tip').css('opacity', 0);
    }, 200)
});


$('.pan').bind('mousewheel', e => {
    level = $('.tools_zoom input').val() / 10;

    if(e.originalEvent.wheelDelta /120 > 0) {
        if(scrollLevel < 30) {
            scrollLevel++
        }
    } else {
        if(scrollLevel > 10) {
            scrollLevel--
        }
    }
    $('.tools_zoom input').val(scrollLevel)
    zoom()

    setTimeout(() => {
        $('.tip').css('opacity', 0);
    }, 200)
});

// Draw

let drawing = false;
let deleting = false;

$('.scene').mousedown(e => {
    if (e.which === 1) {
        drawing = true;
        console.log('drawing')
    }
    if (e.which === 3) {
        deleting = true
    }

});

$(document).mouseup(() => {

    drawing = false;
    deleting = false;

});

$('.scene').contextmenu(e => {
    deletePixel(e, $('.scene'));
    return false;
})


document.onmousemove = e => {

    if(picking){
        $('.pickOverlay').css('left', e.clientX - 20 + 'px')
        //console.log(e.clientX)
        $('.pickOverlay').css('top', e.clientY + - 25 + 'px')
    }

    if(!pan && drawing && !picking){
        draw(e, $('.scene'));
    }


    if(deleting) {
        deletePixel(e, $('.scene'));
    }
}

$('.scene').click(function(e) {
    if(!pan && !picking){
        draw(e, $(this));
    }

});

output = '';
symY = false;
symX = false;
sym = ''
symA = ''

// Get where the pixel should be whilst taking into account scaling

function getRelativePosition(e, el) {
    div = document.getElementById("scene");
    dim = div.getBoundingClientRect();
    x = Math.floor( ((e.clientX - dim.left) / pw) / level);
    y = Math.floor(((e.clientY - dim.top) / pw) / level);
}

function addPixelsToOutput() {
    frameObject = [];

    if($('.keyframes .frame').length == 1) {
        $('.scene_pixel').each(function() {
            output = `${output}${$(this).css('left').slice(0, -2) + 'px'} ${$(this).css('top').slice(0, -2) + 'px'} ${$(this).css('background-color')}, `;
        });
    } else {
        console.log('frame')
        $('.scene .frame').each(function() {
            frame = []
            $(this).find('.scene_pixel').each(function() {
                frame.push(`${$(this).css('left').slice(0, -2) + 'px'} ${$(this).css('top').slice(0, -2) + 'px'} ${$(this).css('background-color')} `)

            })
            frameObject.push(frame)
        })

        endAnimation = []

        if(frameObject[0] == '') {

            endAnimation.push(0 + '%{box-shadow: 0}')

        } else {
            endAnimation.push(0 + '%{box-shadow: ' + frameObject[0].join() + '}')
        }

        for(i = 1; i < frameObject.length; i++) {
            if(frameObject[i] == '') {
                endAnimation.push(0 + (i * (100 / frameObject.length)) + '%{box-shadow: 0}')
                endAnimation.push(0 + (i * (100 / frameObject.length) - 1) + '%{box-shadow: 0}')
                endAnimation.push(0 + (i * (100 / frameObject.length) + 1) + '%{box-shadow: 0}')
            } else {
                endAnimation.push(0 + (i * (100 / frameObject.length)) + '%{box-shadow: ' + frameObject[i].join() + '}')
                endAnimation.push(0 + (i * (100 / frameObject.length) - 1) + '%{box-shadow: ' + frameObject[i - 1].join() + '}')
                endAnimation.push(0 + (i * (100 / frameObject.length) + 1) + '%{box-shadow: ' + frameObject[i].join() + '}')
            }

        }

        if(frameObject[0] == '') {

            endAnimation.push(100 + '%{box-shadow: ' + frameObject[0].join() + '}')

        } else {
            endAnimation.push(100 + '%{box-shadow:0}')
        }

        if(frameObject[frameObject.length - 1] == '') {
            endAnimation.push(99 + '%{box-shadow:0}')

        } else {
            endAnimation.push(99 + '%{box-shadow: ' + frameObject[frameObject.length - 1].join() + '}')
        }

        animationTime = (1000 / fpsInput) * frameObject.length + 'ms';

        console.log(animationTime)

    }

}

function checkSymetry(el) {
    // If symetry is on for y plane
    if(symY == true && symX == false) {
        if(pw % 2 != true){
            sym = (sh) - (y + 1) * pw
        } else {
            sym = (sh) - (y - 0.5) * pw;
        }
        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${relativex}px; top:${sym}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);
    }

    // If symetry is on for x plane
    if(symX == true && symY == false) {
        sym = (sw) - (x + 1) * pw
        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${sym}px; top:${relativey}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);
    }

    if(symX == true && symY == true) {
        sym = (sw) - (x + 1) * pw;
        symA = (sh) - (y + 1) * pw;
        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${relativex}px; top:${symA}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);
        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${sym}px; top:${relativey}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);

        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${sym}px; top:${symA}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);
    }
}

function draw(e, el) {
    // Calculate positions
    getRelativePosition(e, el);

    output = ''; // Reset our end CSS

    $('.pcount .c').html($('.scene_pixel').length)
    let f = $('.activeF').data('frame'); // This will need to change
    console.log(f)
    makeCanvasPreview(f)


    if(x < (sw / pw) && y < (sh / pw) && x > -1 && y > -1) { // Check if not out of bounds
        // Remove any overlapping pixels
        $('.frame' + activeFrame + ' .scene_pixel').each(function() {
            if($(this).css('top') == `${y * pw}px` && $(this).css('left') == `${x * pw}px`) {
                $(this).remove();
            }
        })

        relativex = (x * pw); // Cater for scale
        relativey = (y * pw); // Cater for scale

        // Add pixel
        console.log(activeFrame)
        $('.frame' + activeFrame + ' .pixels').append(`<div class="scene_pixel" style="left:${relativex}px; top:${relativey}px; width:${pw}px; position: absolute; height:${pw}px; background:${currentColor}"></div>`);

        checkSymetry(el);

        // Add all scene pixels to an output variable which is injected in to the form post for a new pen
        addPixelsToOutput()
    }
    // Inject data
    updateForm();
}

function deletePixel(e, el) {
    // Calculate positions
    getRelativePosition(e, el);
    output = '';  // Reset our end CSS

    $('.pcount .c').html($('.scene_pixel').length)

    // Remove pixels
    $('.frame' + activeFrame + ' .scene_pixel').each(function() {
        if($(this).css('top') == `${y * defPixelWidth}px` && $(this).css('left') == `${x * defPixelWidth}px`) {
            $(this).remove();
        }
    });

    // Add all scene pixels to an output variable which is injected in to the form post for a new pen
    addPixelsToOutput();

    // Inject data
    updateForm();
}

// Make panable
$('.picker').draggable();

$('.tools_symx').click(function(){
    $(this).toggleClass('inactive')    

    if(symX == false) {
        symX = true;
        $('.scene').append('<div class="symx"></div>')
    } else {
        symX = false;
        $('.symx').remove();
    }
    console.log(symX)
})

$('.tools_symy').click(function(){
    $(this).toggleClass('inactive')    

    if(symY == false) {
        symY = true;
        $('.scene').append('<div class="symy"></div>')
    } else {
        symY = false;
        $('.symy').remove();
    }
    console.log(symX)
})
// Animations
$('select').change(function(){
    $('.scene').removeClass('Spin');
    $('.scene').removeClass('Bounce')
    $('.scene').removeClass('Wobble')
    $('.scene').addClass($(this).val())
})

// Let's initiate our color pickers
var currentColor = '#ffffff';
let bgColor = '#2f303e';

$("#colorpicker").spectrum({
    color: "ffffff",
    preferredFormat: "hex",
    flat: true,
    showInput: true,
    move(color) {
        currentColor = color.toHexString(); // #ff0000
        $('.output').html(currentColor);
        $('.picker .col').css('background', currentColor);
    }
});

$("#bgpicker").spectrum({
    color: "2f303e",
    preferredFormat: "hex",
    showInput: true,
    move(color) {
        bgColor = color.toHexString(); // #ff0000
        $('body').css('background', bgColor);
        $('.coutput').html(bgColor);
    }
});

$('.name').keyup(() => {
    updateForm()
})
function updateForm() {

    console.log(' There are ' + $('.keyframes .frame').length)
    if($('.keyframes .frame').length == 1) {
        console.log('test')
        CSS = `$baseSize: ${pw}px; \/\/ Change base size\r\n$pixelWidth: ${sw};\r\n$pixelHeight: ${sh};\r\n$bg: ${bgColor};\r\n$dither: 10;\r\n$r: #ea1818;\r\n$black: #c38f4e;\r\n$w: #ffffff;\r\n\r\n\/\/ x, y, c\r\n$shadows:(  \r\n);\r\n\r\n$end-shadow: '';\r\n\r\n@each $x, $y, $c in $shadows {\r\n    $rand: random($dither);\r\n    $shadow-x: $baseSize * $x; \r\n    $shadow-y: $baseSize * $y; \r\n    $shadow: $shadow-x $shadow-y 0 $c;\r\n    $end-shadow: $end-shadow + $shadow + ', ';\r\n    @debug($end-shadow);\r\n}\r\n\r\n%abs {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    margin: auto;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n}\r\n\r\n%scene {\r\n    @extend %abs;\r\n\r\n    ${hasReflect}width: $pixelWidth + px;\r\n    height: $pixelHeight + px;\r\n    background: $bg;\r\n    \r\n    &::after {\r\n        position: relative;\r\n        box-shadow: ${output}; \r\n        width: $baseSize;\r\n        height: $baseSize;\r\n        display: block;\r\n        content: '';\r\n    }\r\n}\r\n\r\nbody {\r\n    @extend %scene;\r\n}`  
    } else {
        console.log('test2')
        CSS = `$baseSize: ${pw}px; \/\/ Change base size\r\n$pixelWidth: ${sw};\r\n$pixelHeight: ${sh};\r\n$bg: ${bgColor};\r\n$dither: 10;\r\n$r: #ea1818;\r\n$black: #c38f4e;\r\n$w: #ffffff;\r\n\r\n\/\/ x, y, c\r\n$shadows:(  \r\n);\r\n\r\n$end-shadow: '';\r\n\r\n@each $x, $y, $c in $shadows {\r\n    $rand: random($dither);\r\n    $shadow-x: $baseSize * $x; \r\n    $shadow-y: $baseSize * $y; \r\n    $shadow: $shadow-x $shadow-y 0 $c;\r\n    $end-shadow: $end-shadow + $shadow + ', ';\r\n    @debug($end-shadow);\r\n}\r\n\r\n%abs {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    margin: auto;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n}\r\n\r\n%scene {\r\n    @extend %abs;\r\n\r\n    ${hasReflect}width: $pixelWidth + px;\r\n    height: $pixelHeight + px;\r\n    background: $bg;\r\n    \r\n    &::after {\r\n        position: relative;\r\n        animation: anim ${animationTime} infinite; \r\n        width: $baseSize;\r\n        height: $baseSize;\r\n        display: block;\r\n        content: '';\r\n    }\r\n}\r\n\r\nbody {\r\n    @extend %scene;\r\n} @keyframes anim {${endAnimation.join('')}}`  
    }


    CSS.replace(/"/g, "&quot;").replace(/'/g, "&apos;");

    const data = {
        title              : $('.name').val(),
        css                : CSS,
        css_pre_processor  : "scss",
        html : "<!-- Made using the No Div Pixel Art Scene Builder by Jamie Coulter https://codepen.io/jcoulterdesign/pen/oqPNXL -->"
    };

    const JSONstring = JSON.stringify(data);

    $('.change').val(JSONstring);
}

const el = $('body');
var CSS = "";


const data = {
    title              : "",
};

const JSONstring = 
      JSON.stringify(data);

const form = 
      `<form action="https://codepen.io/pen/define" method="POST" target="_blank"><input class="change" type="hidden" name="data" value='${JSONstring}'><input type="submit" width="40" height="40" value="Export to new pen"></form>`;

$('.tools_export_code').append(form);

function makeCanvas(f) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = sw;
    canvas.height = sh;
    
    


    let data = `<svg xmlns="http://www.w3.org/2000/svg" style="background:${bgColor};" width="1000" height="1000"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">${$('.frame' + f + ' .pixels').html()}</div></foreignObject></svg>`;
    data = encodeURIComponent(data);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            const newImg = document.createElement('img');
            const url = URL.createObjectURL(blob);
            window.open(url);
        });
    }
    img.src = `data:image/svg+xml,${data}`

    return img;
}



function makeCanvasPreview(frame) {
    console.log('f is' + frame);
    const canvas = document.getElementById('canvas' + frame);
    console.log(canvas)
    const ctx = canvas.getContext('2d');
    canvas.width = sw;
    canvas.height = sh;


    let data = `<svg xmlns="http://www.w3.org/2000/svg" style="background:${bgColor};" width="1000" height="1000"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">${$('.frame' + frame).html()}</div></foreignObject></svg>`;
    data = encodeURIComponent(data);
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            const newImg = document.createElement('img');
            const url = URL.createObjectURL(blob);
        });
    }
    img.src = `data:image/svg+xml,${data}`

    return img;
}

$('.tools_export_png').click(() => {
    makeCanvas($('.activeF').data('frame'));
})

pan = false;
$('.pan').draggable();
$('.pan').draggable('disable');



$('.tools_pan').click(function() {
    $(this).toggleClass('inactive')
    if(pan == false) {
        $('.pan').draggable('enable');
        $('.pan').css('cursor','move');
        pan = true
    } else {
        pan = false
        $('.pan').css('cursor','default');
        $('.pan').draggable('disable');
    }

})
$(document).keydown(event => {
    if ( event.which == 32 ) {
        pan = true
        $('.tools_pan').removeClass('inactive')
        $('.pan').draggable('enable');
        $('.pan').css('cursor','move');
    }
    if ( event.which == 80 ) {
        $('.pick').click();
    }

    if ( event.which == 71 ) {
        $('.tools_grid').click();
    }

    if ( event.which == 67 ) {
        $('.tools_center').click();
    }

    if ( event.which == 88 ) {
        $('.tools_symx').click();
    }

    if ( event.which == 89 ) {
        $('.tools_symy').click();
    }
})

$(document).keyup(event => {
    if ( event.which == 32 ) {
        pan = false   
        $('.tools_pan').addClass('inactive')
        $('.pan').css('cursor','default');
        $('.pan').draggable('disable');
    }
})

$('.tools_center').click(function() {
    $('.pan').css({'left': '0px'})
    $('.pan').css({'top': '0px'})
    $('.pan').css({'transition': 'transform .5s, top .5s, left .5s'})

    setTimeout(function(){
        $('.pan').css({'transition': 'transform 0s, top 0s, left 0s'})

    }, 1000)

})
picking = false;


$('.pick').click(function(e){
    picking = true;
    $('.pickOverlay').css('background', bgColor)
    $('.pickOverlay').show()
    $('.fa-crosshairs').addClass('active')
    $('.pickOverlay').css('left', e.clientX - 20 + 'px')
    //console.log(e.clientX)
    $('.pickOverlay').css('top', e.clientY + - 25 + 'px')
})



$(document).on('click', '.scene_pixel', function(){
    if(picking){
        $("#colorpicker").spectrum("set", $(this).css('background'));
        currentColor = $(this).css('background')
        picking = false;
        $('.pickOverlay').hide()
        $('.fa-crosshairs').removeClass('active')
    }
})

$(document).on('click', '.pan', function(){
    if(picking){
        picking = false;
        $('.pickOverlay').hide()
        $('.fa-crosshairs').removeClass('active')
    }
})

$(document).on('mouseenter', '.scene_pixel', function(){
    if(picking){
        console.log('tesdt')
        $('.pickOverlay').css('background', $(this).css('background'))
    }
})

$('select').select2();
$(document).on('mouseleave', '.scene_pixel', function() {
    if(picking){
        console.log('tesdt')
        $('.pickOverlay').css('background', bgColor)
    }
})

// keyframes

frames = 1;
activeFrame = 1;
onionSkinOn = true;

function onionSkin(e){
    if(onionSkinOn) {
        $('.scene .frame').css('opacity',1)
        $('.scene .frame' + (e - 1)).show().css('opacity', 0.4)
        console.log($('.scene .frame' + (e-1)))
    } else {
        $('.scene .frame' + (e - 1)).hide()
        $('.scene .frame').css('opacity',1)
    }
}


$('#onion').click(function(){
    if(onionSkinOn) {
        onionSkinOn = false
    } else {
        onionSkinOn = true
    }

    onionSkin($('.activeF').data('frame'))
})

function buildKeyframes() {
    animation = 0;
    base = 100 / $('.scene .frame').length;


    console.log(animation);
}

animationProgress = 0;
fpsInput = 30;

$('.controls input.f').change(function(){
    stopAnimation()
    fpsInput = $(this).val();
})

function playAnimation(){
    fps = 1000 / fpsInput
    $('.scene .frame').css('opacity',1)
    anim = setInterval(function() {
        animationProgress++;
        if(animationProgress < $('.scene .frame').length + 1){
            $('.scene .frame').hide();
            $('.scene .frame' + animationProgress).show();
        } else {
            animationProgress = 0;
        }
        console.log(animationProgress)
    }, fps)    
}

playing = false;

$('.play').click(function(){

    if(playing) {
        stopAnimation()
        playing = false;
        $(this).html('<i class="fa fa-play"></i>')
    } else {
        playAnimation()
        playing = true;
        $(this).html('<i class="fa fa-stop"></i>')
    }
})
frame = 1;
$('.stop').click(function(){
    stopAnimation()
})

$('.keyframes .frames .frame1').append('<canvas id="canvas' + 1 + '"></canvas>')


function stopAnimation() {
    clearInterval(anim);
}

$('.wrap').draggable({ axis: "x" })

$('.fa-copy').click(function(){
    frames++;
    $('.scene .frame').hide();
    $('.scene').append('<div class="frame frame' + frames +'"><div class="pixels">' + $('.scene .frame' + $(this).parent().data('frame')).html() + '</div></div>');
    

    $('.activeF').removeClass('activeF')
    $('.keyframes .frames .wrap').append('<div data-frame="' + frames +'" class="frame activeF frame' + frames +'"><div class="frameTitle">Frame #' + frames + '</div><i class="fa fa-trash"> </i><i class="fa fa-copy"> </i></div>');
    $('.keyframes .frames .frame' + frames).append('<canvas id="canvas' + frames + '"></canvas>')
    activeFrame = frames;
    onionSkin(frames);
    buildKeyframes();
     makeCanvasPreview(parseInt($(this).parent().data('frame') + 1))
})

$('.keyframes .add').click(function() {
    frames++;
    $('.scene .frame').hide();
    $('.scene').append('<div class="frame frame' + frames +'"><div class="pixels"></div></div>');
    $('.activeF').removeClass('activeF')
    $('.keyframes .frames .wrap').append('<div data-frame="' + frames +'" class="frame activeF frame' + frames +'"><div class="frameTitle">Frame #' + frames + '</div><i class="fa fa-trash"> </i><i class="fa fa-copy"> </i></div>');
    $('.keyframes .frames .frame' + frames).append('<canvas id="canvas' + frames + '"></canvas>')
    activeFrame = frames;
    onionSkin(frames);
    buildKeyframes();
});

$(document).on('click', '.keyframes .frame', function() {
    $('.activeF').removeClass('activeF');
    $(this).addClass('activeF')

    let clicked = $(this).data('frame');

    $('.scene .frame').hide();
    $('.scene .frame' + clicked).show();
    activeFrame = clicked;
    onionSkin(clicked);
    buildKeyframes();
});

$('.fa.fa-step-forward').click(function(){
    $('.activeF').next().click()
})

$('.fa.fa-fast-forward').click(function(){
    $('.keyframes .frame:last').click()
})

$('.fa.fa-fast-backward').click(function(){
    $('.keyframes .frame:first').click()
})

$('.fa.fa-step-backward').click(function(){
    $('.activeF').prev().click()
})

// clone
// delete
// Rearrange
// prevent overdragging












// Width of canvas shouldnt reset when pixel size is changed. It needs to multiply inside the check aspect function
// Symetry only works on even pixels
// Output reflection to css
// reflect works but only if you draw after the selection
// Export animation to new pen
// key commands shouldnt fire on an input