var myWindowFade = document.getElementById('start-window-fade'),
            myWindow = document.getElementById('window');
        myWindowFade.style.width = window.innerWidth + "px";
        myWindowFade.style.height = window.innerHeight + "px";
        myWindow.style.width = window.innerWidth + "px";
        myWindow.style.height = window.innerHeight + "px";
        window.onresize = function() {
            myWindowFade.style.width = window.innerWidth + "px";
            myWindowFade.style.height = window.innerHeight + "px";
            myWindow.style.width = window.innerWidth + "px";
            myWindow.style.height = window.innerHeight + "px";
        }
        var myVar = setInterval(myTimer, 1000);

        function myTimer() {
            var date = new Date();
            document.getElementById("time").textContent = date.toLocaleTimeString();
        }

        function showTimer() {
            'use strict';
            var myDiv = document.getElementById("history"),
                date = new Date(),
                year = date.getUTCFullYear(),
                month = date.getUTCMonth(),
                day = date.getUTCDate();
            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            myDiv.textContent = year + '/' + month + '/' + day;
        }
        showTimer();
        var d = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        document.getElementById("day").innerHTML = days[d.getDay()];
        document.getElementById("number-day").innerHTML = d.getUTCDate();
        /*$(".strat-win").click(function(){
            $('.start-window-fade').fadeToggle();
            $('.start-window').fadeToggle();
        }); 
        $('.start-window-fade').click(function () {
            $('.start-window-fade').fadeOut();
            $('.start-window').fadeOut();
        });*/
        document.getElementById('strat-win').onclick = function() {
            'use strict';
            if (document.getElementById('start-window-fade').style.opacity <= .1) {
                fadeInByMe(document.getElementById('start-window-fade'));
                fadeInByMe(document.getElementById('start-window'));
            } else if (document.getElementById('start-window-fade').style.opacity >= 1) {
                fadeOutByMe(document.getElementById('start-window-fade'));
                fadeOutByMe(document.getElementById('start-window'));
            }
        }
        document.getElementById('start-window-fade').onclick = function() {
            'use strict';
            fadeOutByMe(document.getElementById('start-window-fade'));
            fadeOutByMe(document.getElementById('start-window'));
        }
        document.getElementById('close-all').onclick = function() {
            if (document.getElementById('start-window-fade').style.opacity >= 1) {
                fadeOutByMe(document.getElementById('start-window-fade'));
                fadeOutByMe(document.getElementById('start-window'));
            }
            if (computerOverlay.style.transform == "scale(1)") {
                computerOverlay.style.transform = "scale(0)";
                document.getElementById('a1').style.borderBottom = '2px solid #76b9ed';
            }
            if (imageOverlay.style.transform == "scale(1)") {
                imageOverlay.style.transform = "scale(0)";
                document.getElementById('a2').style.borderBottom = '2px solid #76b9ed';
            }
            if (videoOverlay.style.transform == "scale(1)") {
                videoOverlay.style.transform = "scale(0)";
                document.getElementById('a3').style.borderBottom = '2px solid #76b9ed';
            }
            if (noteOverlay.style.transform == "scale(1)") {
                noteOverlay.style.transform = "scale(0)";
                document.getElementById('a4').style.borderBottom = '2px solid #76b9ed';
            }
            if (aboutOverlay.style.transform == "scale(1)") {
                aboutOverlay.style.transform = "scale(0)";
                document.getElementById('a5').style.borderBottom = '2px solid #76b9ed';
            }
        }

        function fadeOutByMe(element) {
            'use strict';
            var opacity = 1,
                timer = setInterval(function name(params) {
                    if (opacity <= .1) {
                        clearInterval(timer);
                        element.style.display = 'none';
                        document.getElementById('container-start').classList.remove('activecontainer');
                    }
                    element.style.opacity = opacity;
                    opacity -= 0.1;
                }, 50);
        }
        var scor = document.getElementsByClassName('second-column')[0];

        function fadeInByMe(element) {
            'use strict';
            var opacity = 0.1,
                timer = setInterval(function name(params) {
                    if (opacity >= 1) {
                        clearInterval(timer);
                    }
                    if (opacity >= .5) {
                        document.getElementById('container-start').classList.add('activecontainer');
                    }
                    element.style.opacity = opacity;
                    opacity += 0.1;
                }, 50);
            element.style.display = 'block';
        }
        var computer = document.getElementById('icon-computer');
        $('#myTabs a').click(function(e) {
            e.preventDefault()
            $(this).tab('show')
        });
        $('#myTabs a[href="#profile"]').tab('show') // Select tab by name
        $('#myTabs a:first').tab('show') // Select first tab
        $('#myTabs a:last').tab('show') // Select last tab
        $('#myTabs li:eq(2) a').tab('show') // Select third tab (0-indexed)
        var imageOverlay = document.getElementById('image-overlay');

        function openimg() {
            imageOverlay.style.transform = "scale(1)";
            document.getElementById('a2').style.display = "block";
        }

        function closeimg() {
            imageOverlay.style.transform = "scale(0)";
            document.getElementById('a2').style.display = "none";
        }
        var aboutOverlay = document.getElementById('about-overlay');

        function openabout() {
            aboutOverlay.style.transform = "scale(1)";
            document.getElementById('a5').style.display = "block";
        }

        function closeabout() {
            aboutOverlay.style.transform = "scale(0)";
            document.getElementById('a5').style.display = "none";
        }

        document.getElementById('a5').onclick = function() {
            if (aboutOverlay.style.transform == "scale(1)") {
                aboutOverlay.style.transform = "scale(0)";
                this.style.borderBottom = '2px solid #76b9ed';
            } else {
                aboutOverlay.style.transform = "scale(1)"
                this.style.border = 'none';
            }
        }


        document.getElementById('a2').onclick = function() {
            if (imageOverlay.style.transform == "scale(1)") {
                imageOverlay.style.transform = "scale(0)";
                this.style.borderBottom = '2px solid #76b9ed';
            } else {
                imageOverlay.style.transform = "scale(1)"
                this.style.border = 'none';
            }
        }
        var videoOverlay = document.getElementById('video-overlay');

        function openvid() {
            videoOverlay.style.transform = "scale(1)";
            document.getElementById('a3').style.display = "block";
        }

        function closevid() {
            videoOverlay.style.transform = "scale(0)";
            document.getElementById('a3').style.display = "none";
        }
        document.getElementById('a3').onclick = function() {
            if (videoOverlay.style.transform == "scale(1)") {
                videoOverlay.style.transform = "scale(0)";
                this.style.borderBottom = '2px solid #76b9ed';
            } else {
                videoOverlay.style.transform = "scale(1)"
                this.style.border = 'none';
            }
        }
        var noteOverlay = document.getElementById('note-overlay');

        function opennote() {
            noteOverlay.style.transform = "scale(1)";
            document.getElementById('a4').style.display = "block";
        }

        function closenote() {
            noteOverlay.style.transform = "scale(0)";
            document.getElementById('a4').style.display = "none";
        }
        document.getElementById('a4').onclick = function() {
            if (noteOverlay.style.transform == "scale(1)") {
                noteOverlay.style.transform = "scale(0)";
                this.style.borderBottom = '2px solid #76b9ed';
            } else {
                noteOverlay.style.transform = "scale(1)"
                this.style.border = 'none';
            }
        }
        var computerOverlay = document.getElementById('overlay-computer');

        function opencom() {
            computerOverlay.style.transform = "scale(1)";
            document.getElementById('a1').style.display = "block";
        }

        function closecom() {
            computerOverlay.style.transform = "scale(0)";
            document.getElementById('a1').style.display = "none";
        }

        function closeopencom() {
            computerOverlay.style.transform = "scale(0)";
            document.getElementById('a1').style.display = "block";
            document.getElementById('a1').style.borderBottom = '2px solid #76b9ed';
        }
        document.getElementById('a1').onclick = function() {
            if (computerOverlay.style.transform == "scale(1)") {
                computerOverlay.style.transform = "scale(0)";
                this.style.borderBottom = '2px solid #76b9ed';
            } else {
                computerOverlay.style.transform = "scale(1)"
                this.style.border = 'none';
            }
        }
        var div = document.getElementById('overlay-computer'),
            mouseclick = document.getElementById('first-row-win');

        mouseclick.addEventListener('mousedown', function(e) {
            isDown = true;
            offset = [
                div.offsetLeft - e.clientX,
                div.offsetTop - e.clientY
            ];
        }, true);

        document.addEventListener('mouseup', function() {
            isDown = false;
        }, true);

        document.addEventListener('mousemove', function(event) {
            event.preventDefault();
            if (isDown) {
                mousePosition = {

                    x: event.clientX,
                    y: event.clientY

                };
                div.style.left = (mousePosition.x + offset[0]) + 'px';
                div.style.top = (mousePosition.y + offset[1]) + 'px';
            }
        }, true);

        var resizer = document.getElementsByClassName('resizer')[0];
        resizer.addEventListener('mousedown', initDrag, false);
        div.onresize = function() {
            resizer.style.bottom = 0;
            resizer.style.right = 0;
        }

        var startX, startY, startWidth, startHeight;

        function initDrag(e) {
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(div).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(div).height, 10);
            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        }

        function doDrag(e) {
            div.style.width = (startWidth + e.clientX - startX) + 'px';
            div.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopDrag(e) {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        }
        div.onscroll = function() {
            resizer.style.bottom = (0 - div.scrollTop) + "px";
            resizer.style.right = 0;
        }

        function upercom() {
            div.style.width = "100%";
            div.style.top = "0";
            div.style.left = "0";
            div.style.height = "95.3vh";
            document.getElementById('upercam').style.display = "none";
            document.getElementById('returncam').style.display = "inline";
        }

        function returncom() {
            div.style.width = "70%";
            div.style.top = "20%";
            div.style.left = "15%";
            div.style.height = "60%";
            document.getElementById('returncam').style.display = "none";
            document.getElementById('upercam').style.display = "inline";
        }

        function powerOff() {
            fadeOutByMe(myWindow);
        }
        var colorBox = document.getElementsByClassName('color-box')[0],
            btn = document.getElementsByClassName('gear-check')[0];
        btn.onclick = function parenti() {
            'use strict';
            colorBox.style.right = `-${colorBox.offsetWidth}px`;
            btn.style.right = `-${colorBox.offsetWidth}px`;
            btn.onclick = function childi() {
                colorBox.style.right = `0px`;
                btn.style.right = `0px`;
                btn.onclick = function() {
                    return parenti();
                }
            }
        }