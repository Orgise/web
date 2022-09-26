var buttons = 256,
	rows = 16;
var cols = rows;
var wLoaded = false,
	nLoaded = false;

$(document).ready(function() {
	var holder = $('#board .holder'),
		note = $('.note');
	var notes = [];

	for (var i = 0; i < rows; i++) {
		notes[i] = new Howl({
			urls: ['https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.mp3',
				'https://s3-us-west-2.amazonaws.com/s.cdpn.io/380275/' + i + '.ogg'
			],
			onload: loadCount(i + 1)
		});
	}

	$(window).load(function() {
		bindUserActions();
		initControls();

		wLoaded = true;
		if (nLoaded)
			$('#board').removeClass('loading').addClass('forward');

		for (var i = 0; i < rows; i++) {
			bindNote(i);
		}
	});

	function loadCount(i) {
		if (i === rows) {
			nLoaded = true;
			if (wLoaded)
				$('#board').removeClass('loading').addClass('forward');
		}
	}

	function bindNote(currNote) {
		$('#board .holder:nth-child(' + cols + 'n + ' + currNote + ')')
		.on('webkitAnimationIteration mozAnimationIteration animationiteration', 
		function() {
			if ($(this).hasClass('active')) {
				var currNote = $(this).attr('data-note');
				notes[currNote].play();

				$(this).find('.ripple').addClass('huzzar').delay(500).queue(function() {
					$(this).removeClass('huzzar').dequeue();
				});
			}
		});
	}

	function bindUserActions() {
		$(note).mousedown(function() {
			$(this).toggleClass("active");
			$(this).parent().toggleClass("active");
		});
		$(document).mousedown(function() {
			$(note).bind('mouseover', function() {
				$(this).toggleClass("active");
				$(this).parent().toggleClass("active");
			});
		}).mouseup(function() {
			$(note).unbind('mouseover');
		});
		$("#dialogSave").dialog({
			autoOpen: false,
			modal: true,
			closeText: "&#10006;",
			hide: 200
		});
		$("#dialogLoad").dialog({
			autoOpen: false,
			buttons: [{
				text: "Play",
				click: function() {
					importLoop($(this));
				}
			}],
			modal: true,
			closeText: "&#10006;",
			hide: 200
		});
	}

	function initControls() {
		$('#reset').on('click', function() {
			$('.active').removeClass('active');
		});
		$('#audio').on('click', function() {
			if ($(this).hasClass("mute"))
				Howler.unmute();
			else
				Howler.mute();
			$(this).toggleClass('mute');
		});
		$('#save').on('click', function() {
			if ($(".dialog").dialog("isOpen") !== true)
				exportLoop();
		});
		$('#load').on('click', function() {
			if ($(".dialog").dialog("isOpen") !== true)
				$("#dialogLoad").dialog("open");
		});

		$('.ui-dialog').on('dialogopen', function(event) {
			$('body').addClass('no-overflow');
			Howler.volume(0.5);
			$('#ui-widget-overlay').addClass('visible');
		}).on('dialogclose', function(event) {
			$('body').removeClass('no-overflow');
			Howler.volume(1);
			$('textarea#saveCode').val('');
			$('#ui-widget-overlay').removeClass('visible');
		});
	}

	//:x represents ON //;x represents OFF
	function exportLoop() {
		var noteCode = "",
			offCount = 0,
			onCount = 0;

		holder.each(function() {
			if ($(this).hasClass('active')) {
				if (offCount > 0)
					noteCode = noteCode + ";" + offCount;
				onCount++;
				offCount = 0;
			} else {
				if (onCount > 0)
					noteCode = noteCode + ":" + onCount + " ";
				offCount++;
				onCount = 0;
			}
		});

		if (offCount > 0)
			noteCode = noteCode + ";" + offCount;
		else if (onCount > 0)
			noteCode = noteCode + ":" + onCount;

		$("#saveCode").val("[" + noteCode + "]");
		$("#dialogSave").dialog("open");
	}

	function importLoop(dialog) {
		var noteCode = '',
			 noteState,
			 error = false,
			 note;

		noteCode = dialog.find('textarea#importCode').val();
		dialog.dialog("close");

		noteCode = noteCode.replace("[", "");
		noteCode = noteCode.replace("]", "");

		if (noteCode.charAt(0) === ":")
			noteState = 1;
		else if (noteCode.charAt(0) === ";")
			noteState = 0;
		else {
			alert("Your note code wasn't recognised");
			error = true;
		}

		if (!error) {
			$('.active').removeClass('active');
			noteCode = noteCode.substr(1);
			var splitCode = noteCode.split(/:|;/g);
			var noteCounter = 0;

			for (i = 0; i < splitCode.length; i++) {
				var currNum = parseInt(splitCode[i]);

				if (noteState) {
					for (var n = 0; n < currNum; n++) {
						noteCounter++;
						note = $('#board span:nth-child(' + noteCounter + ')');
						note.addClass('active');
						note.children().addClass('active');
					}
				} else {
					noteCounter = noteCounter + currNum;
				}
				noteState = !noteState;
			}
		}
	}
});

social("codepen/woodwork", "twitter/joeharry__", "light");