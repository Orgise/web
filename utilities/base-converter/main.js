function doThing(fild) {
	console.log(fild);
	var	val = document.getElementById(fild).value;
	var base = getBase(fild);
	console.log(base);
	setFilds(val, base);
}

function getBase(fild) {
	var base = 0;
	switch(fild){
		case "decimal":
			base = 10;
			break;
		case "binary":
			base = 2;
			break;
		case "octal":
			base = 8;
			break;
		case "hexa":
			base = 16;
			break;
	}
	
	return base;
}

function setFilds(val, base) {
	if(val.length >= 1){
		document.getElementById("decimal").value = parseInt(val, base).toString(10);
		document.getElementById("binary").value = parseInt(val, base).toString(2);
		document.getElementById("octal").value = parseInt(val, base).toString(8);
		document.getElementById("hexa").value = parseInt(val, base).toString(16).toUpperCase();
	}
}