(function(){
	let pinged = false;
	let nav = document.querySelector(".nav"); // Selecciona el menú mediante su clase CSS
	let stickyScrollPoint = document.querySelector(".hero-image").offsetHeight; // Punto clave
	// console.log(stickyScrollPoint);

	function pingToTop(){ // Fijar el menú
		if (pinged) {
			return;
		}

		nav.classList.add("pined");
		pinged = true;
	}

	function unPingFromTop(){ // No fijar el menú
		// console.log(pinged);
		if (!pinged) {
			return;
		}

		nav.classList.remove("pined");
		pinged = false;
	}

	window.addEventListener("scroll", function(ev) { // Cada vez que se scrollea se ejecuta
		
		if (window.scrollY < stickyScrollPoint) { // Al tocar el hero-image se queda en su sitio
			return unPingFromTop();
		}
		
		let coords = nav.getBoundingClientRect(); // Posición del menú respecto al hero-image

		if (coords.top <= 0) {
			return pingToTop();
		}
		unPingFromTop();
		// console.log(coords)
	})

})();